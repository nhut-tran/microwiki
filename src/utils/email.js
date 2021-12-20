const nodeMailer = require('nodemailer')
const path = require('path')
class SendEmail {
    constructor(user, url) {
        this.to = user.email,
        this.from = 'Micro-wiki <trannhut1707@gmail.com>'
        this.url = url
    }

    createTransport() {
       return nodeMailer.createTransport({
           service: 'SendGrid',
           auth: {
               user: 'apikey',
               pass: process.env.EMAIL_PASS
           }
       })
    }

   async send(template, subject) {
       const options = {
            from: this.from,
            to: this.to,
            subject,
            html: template,
            attachments: [{
                filename: 'logo.png',
                path: path.join(__dirname + '../../../public/img/logo.png'),
                cid: 'logo@cid'
            }]
       }
       await this.createTransport().sendMail(options)
    }
}

module.exports = SendEmail