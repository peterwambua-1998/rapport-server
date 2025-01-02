const { Shortlisting, ShortlistedCollaborators, JobSeeker, ShortlistedCandidates, RecruiterProfile, sequelize } = require("../models");
const { Op } = require('sequelize')

exports.create = async (req, res) => {
    try {
        const { note, projectId, collaborators, candidates } = req.body;

        const listing = await Shortlisting.create({
            UserId: req.user.id,
            ProjectId: projectId,
            note: note,
            status: true
        });
        let collaboratorsBulk = [];
        let candidatesBulk = [];

        collaborators.forEach(element => {
            collaboratorsBulk.push({ UserId: element.user_id, ProjectId: projectId, ShortlistingId: listing.id })
        });

        candidates.forEach(element => {
            candidatesBulk.push({ UserId: element.id, ProjectId: projectId, ShortlistingId: listing.id })
        });

        await ShortlistedCollaborators.bulkCreate(collaboratorsBulk);
        await ShortlistedCandidates.bulkCreate(candidatesBulk);

        return res.json({ msg: 'success' });
    } catch (error) {
        return res.json(error).status(500)
    }
}

exports.getCollaborators = async (req, res) => {
    try {
        const profile = await RecruiterProfile.findOne({ where: { user_id: req.user.id } })
        if (!profile) {
            return res.json([]).status(500)
        }
        const collaborators = await RecruiterProfile.findAll({ where: { company_id: profile.company_id, user_id: {[Op.not]: req.user.id} } })
        return res.json(collaborators)
    } catch (error) {
        console.log(error)
        return res.json(error).status(500)
    }
}

exports.deleteListing = async (req, res) => {
    try {
        const { listingId, UserId } = req.body
        await ShortlistedCandidates.destroy({ where: { ShortlistingId: listingId, UserId: UserId } })
        return res.json('success');
    } catch (error) {
        console.log(error);
        return res.json(error).status(500)
    }
}

exports.getUnshortlistedCandidates = async (req, res) => {
    try {
        const { id } = req.body; // Assuming projectId is passed as a query parameter
        const listings = await Shortlisting.findAll({
            where: { ProjectId: id },
            include: [ShortlistedCollaborators, ShortlistedCandidates]
        })
        return res.json(listings);
    } catch (error) {
        console.error("Error fetching unshortlisted candidates:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

