const nodemailer = require('nodemailer')
const config = require('../config/config')
const welcomeEmailTemplate = require('../config/email-templates/welcome')
const verifyEmailTemplate = require('../config/email-templates/verify-email')
const resetPasswordTemplate = require('../config/email-templates/reset-password')
const handleAsync = require('../utils/handleAsync')
class EmailService {
  constructor() {
    // Nodemailer transporter yapılandırması
    this.transporter = nodemailer.createTransport(config.email.smtp)
  }

  async sendWelcomeEmail(user) {
    const htmlContent = welcomeEmailTemplate(user)
    await this.transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: config.email.templates.welcomeEmail.subject,
      html: htmlContent,
    })
  }
  async sendVerificationEmail(user, token) {
    const verificationUrl = `${config.appUrl}/verify-email?token=${token}`

    const htmlContent = verifyEmailTemplate(user, verificationUrl)
    const [response, error] = await handleAsync(
      this.transporter.sendMail({
        from: config.email.from,
        to: user.email,
        subject: 'Email Verification',
        html: htmlContent,
      })
    )
    return [response, error]
  }
  async sendPasswordResetEmail(user, token) {
    const resetUrl = `${config.app.url}/reset-password?token=${token}`

    const htmlContent = resetPasswordTemplate(user, resetUrl)
    await this.transporter.sendMail({
      from: config.email.from,
      to: user.email,
      subject: config.email.templates.resetPassword.subject,
      html: htmlContent,
    })
  }
}

module.exports = new EmailService()
