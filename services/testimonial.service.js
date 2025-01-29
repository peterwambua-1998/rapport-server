const crypto = require('crypto');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

class TestimonialService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async loadEmailTemplate() {
        const templatePath = path.join(__dirname, '../templates/video-testimonial-request.hbs');
        const template = await fs.readFile(templatePath, 'utf-8');
        return handlebars.compile(template);
    }

    async sendTestimonialRequest({ recipientEmail, recipientName, description, senderName, uploadLink }) {
        try {
            const template = await this.loadEmailTemplate();
            const html = template({
                recipientName,
                description,
                uploadLink,
                senderName
            });


            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: recipientEmail,
                subject: 'Video Testimonial Request',
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
            };
        } catch (error) {
            console.log(error);
            throw new Error('Failed to send testimonial request');
        }
    }
}

module.exports = new TestimonialService();