const nodemailer = require('nodemailer')
const config = require('../config/config')

class EmailService {
  constructor() {
    // Nodemailer transporter yapılandırması
    this.transporter = nodemailer.createTransport({
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      secure: config.email.smtp.secure, // true for 465, false for other ports
      auth: {
        user: config.email.smtp.user, // SMTP kullanıcı adı
        pass: config.email.smtp.pass, // SMTP şifresi
      },
    })
  }

  // E-posta gönderim metodu
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: config.email.from, // Gönderen adres
      to, // Alıcı adres
      subject, // Konu
      html, // HTML içeriği
    }

    try {
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent: %s', info.messageId)
      return info
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }
}

module.exports = new EmailService()
