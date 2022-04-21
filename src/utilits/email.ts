import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';

const sendEmail = async (
    email: string,
    subject: string,
    text: string,
    body: string,
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        console.log(process.env.EMAIL);

        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
            html: body,
        });
        console.log(info);
        return info;
    } catch (error) {
        console.log(error);
    }
};

export default sendEmail;
