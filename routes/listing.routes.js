const {
    create,
    getCollaborators,
    deleteListing,
    getUnshortlistedCandidates
} = require("../controllers/shortlisting.controller");

const express = require("express");
const router = express.Router();

router.get('/collaborators', getCollaborators)
router.post('/job-seekers', getUnshortlistedCandidates)
router.post('/create', create)
router.post('/delete', deleteListing)

module.exports = router;
