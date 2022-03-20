import nodemailer from 'nodemailer';
import { text } from 'stream/consumers';

const email = async (
    email: string,
    subject: string,
    text: string,
    body: string,
) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'http://localhost:4001',
            secure: false,
            auth: {
                user: 'rollinssudeb9@gmail.com',
                pass: 'rollins610rollins610',
            },
        });

        let info = await transporter.sendMail({
            from: 'Instagram',
            to: email,
            subject: subject,
            text: text,
            html: body,
        });
    } catch (error) {
        console.log(error);
    }
};
