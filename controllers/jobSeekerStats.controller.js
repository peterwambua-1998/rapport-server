const { JobSeekerStat } = require("../models");

exports.daysOnPlatformStore = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (stats) {
            let d = stats.daysOnPlatform ?? 0;
            await stats.update({ daysOnPlatform: d + 1 });
            return res.status(201).json({
                status: "success",
            });
        }

        res.status(404).json({
            status: "error",
            message: 'stats not found',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}


exports.challengesCompletedStore = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (stats) {
            let c = stats.challengesCompleted ?? 0;
            await stats.update({ challengesCompleted: c + 1 });
            return res.status(201).json({
                status: "success",
            });
        }

        res.status(404).json({
            status: "error",
            message: 'stats not found',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.interviewsCompletedStore = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (stats) {
            let i = stats.interviewsCompleted ?? 0;
            await stats.update({ interviewsCompleted: i + 1 });
            return res.status(201).json({
                status: "success",
            });
        }

        res.status(404).json({
            status: "error",
            message: 'stats not found',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.searchAppearanceStore = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (stats) {
            let s = stats.searchAppearance ?? 0;
            await stats.update({ searchAppearance: s + 1});
            return res.status(201).json({
                status: "success",
            });
        }

        res.status(404).json({
            status: "error",
            message: 'stats not found',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.profileViewsStore = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (stats) {
            let p = stats.profileViews ?? 0;
            await stats.update({ profileViews: p + 1 });
            return res.status(201).json({
                status: "success",
            });
        }

        res.status(404).json({
            status: "error",
            message: 'stats not found',
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

exports.getJobSeekerStats = async (req, res) => {
    try {
        const stats = await JobSeekerStat.findOne({ where: { userId: req.user.id } });
        if (!stats) {
            res.status(404).json({
                status: "error",
                message: 'stats not found',
            });
        }

        return res.status(200).json({
            status: "success",
            stats: stats
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}