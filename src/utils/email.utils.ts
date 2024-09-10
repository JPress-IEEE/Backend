import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (email: string, subject: string, text: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

export const generateEmailToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.EMAIL_SECRET!, { expiresIn: '1d' });
}

export const verifyEmailToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.EMAIL_SECRET!);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};