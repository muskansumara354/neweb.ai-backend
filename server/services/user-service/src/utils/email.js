const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class Email {
  // Reuse transporter
  static transporter = null;

  constructor(user, url) {
    if (!user?.email) {
      throw new Error('User email is required');
    }
    this.to = user.email;
    this.url = url;
    this.from = `Neweb.ai Team <${process.env.EMAIL_FROM}>`;
  }

  getTransport() {
    if (!Email.transporter) {
      Email.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: false,
        pool: true,
      });
    }
    return Email.transporter;
  }

  async send(template, subject) {
    try {
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
        firstName: this.firstName,
        url: this.url,
        subject,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html)
      };

      return await this.getTransport().sendMail(mailOptions);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendContactForm(subject, message, userEmail, mobileNo) {
    if (!userEmail || !subject || !message) {
      throw new Error('Missing required fields');
    }

    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/contact-form.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          userEmail,
          subject,
          userMessage: message,
          mobileNo,
        }
      );

      await this.getTransport().sendMail({
        from: userEmail,
        to: process.env.CONTACT_FORM_RECIPIENT,
        subject,
        html,
        text: htmlToText(html)
      });
    } catch (error) {
      console.error('Contact form email failed:', error);
      throw error;
    }
  }

  async sendWelcome() {
    return this.send('welcome', 'We are glad to have you with us');
  }
}

module.exports =  Email ;
