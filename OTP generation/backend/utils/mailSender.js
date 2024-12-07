// utils/mailSender.js
const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        // Create a Transporter to send emails
        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        // Send emails to users
        let info = await transporter.sendMail({
            from: 'sasikumar.r@mitrahsoft.com',
            to: 'sasikumar.r@mitrahsoft.com',
            subject: title,
            html: body,
        });
        return info;
    } catch (error) {
        console.log(error.message);
    }
};
module.exports = mailSender;