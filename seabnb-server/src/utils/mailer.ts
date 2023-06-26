import nodemailer from 'nodemailer'

interface IMailContent {
    subject: string
    content: string
}

export async function sendMail(to: string, content: IMailContent) {
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASSWORD
    const host = process.env.EMAIL_HOST

    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host,
            secure: false,
            auth: {
                user,
                pass
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <tynxcode.js@gmail.com>', // sender address
            to, // list of receivers
            subject: content.subject,
            html: `<b>${content.content}</b>`, // html body
        });

        return true
    } catch (error) {
        console.log(error);
        return false
    }
}