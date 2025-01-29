const express = require('express');
const router = express.Router();
const { storeRequest, storeVideo } = require('../controllers/testimonial.controller');
const testimonialMiddleware = require('../middleware/testimonialMiddleware');

router.post('/request', storeRequest);
router.post('/video', testimonialMiddleware, storeVideo);

module.exports = router;