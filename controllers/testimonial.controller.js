const { TestimonialRequest, User, Testimonial } = require("../models");
const testimonialService = require("../services/testimonial.service");
const crypto = require('crypto');

exports.storeRequest = async (req, res) => {
    try {
        const user = User.findByPk(req.user.id);

        if (!user) {
            res.json({ status: false, message: 'user not found', }).status(404)
        }

        const { email, recipientName, description } = req.body;

        const token = crypto.randomBytes(32).toString('hex');

        const uploadLink = `${process.env.FRONTEND_URL}/jobseeker/testimonial/${token}`;

        const senderName = `${user.fName} ${user.lName}`;

        await TestimonialRequest.create({
            userId: req.user.id,
            recipientName,
            email,
            description,
            token,
        });


        await testimonialService.sendTestimonialRequest({
            recipientEmail: email,
            recipientName,
            description,
            senderName,
            uploadLink
        });

        res.json({ status: true, message: 'Request sent' })

    } catch (error) {
        res.json({ status: false, message: error.message, }).status(400)
    }
}

exports.storeVideo = async (req, res) => {
    try {
        const { token } = req.body;

        const files = req.files;

        const test = await TestimonialRequest.findOne({ where: { token: token } });

        if (!test) {
            res.json({ status: false, message: 'request not found', }).status(404)
        }

        const video_path = files.video[0].path;

        await Testimonial.create({
            userId: test.userId,
            video: video_path,
            name: test.recipientName,
        });

        // await test.destroy();

        res.json({ status: true, message: 'Request sent' })
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: error.message, }).status(400)
    }
}