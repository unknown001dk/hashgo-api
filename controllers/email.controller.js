import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import User from '../models/user.modal.js';

class EmailService {
  constructor() {
    this.config = {
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    };
    this.transporter = nodemailer.createTransport(this.config);
    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: '#GO Academy',
        link: 'https://hashgotech.info',
      },
    });
  }

  generateMailContent(name, intro, outro, action = null) {
    let content = {
      body: {
        name: name,
        intro: intro,
        outro: outro,
      },
    };

    if (action) {
      content.body.action = action;
    }

    return this.mailGenerator.generate(content);
  }

  async sendMail(to, subject, htmlContent) {
    const message = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(message);
      console.log("Email sent successfully to " + to);
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;  // Re-throw error to handle in controller
    }
  }

  async sendUserRegistrationMail(email, name) {
    const intro = 'Thank you for registering with us...';
    const outro = 'If you have any questions or need assistance, please reach out.';
    const htmlContent = this.generateMailContent(name, intro, outro);
    await this.sendMail(email, 'Welcome to #GO Academy', htmlContent);
  }

  async sendCourseRegistrationMail(email, name) {
    const intro = 'Thank you for registering for our courses...';
    const outro = 'We look forward to your success in your learning journey with us.';
    const htmlContent = this.generateMailContent(name, intro, outro);
    await this.sendMail(email, 'Welcome to #GO Academy', htmlContent);
  }

  async sendScheduledEmailToAllUsers() {
    const userInfo = await User.find({});
    const emailPromises = userInfo.map((data) => {
      const name = data.name;
      const email = data.email;

      const intro = 'This is a reminder that our online class is scheduled to begin...';
      const action = {
        instructions: 'To join the class, please click the button below.',
        button: {
          color: '#22BC66',
          text: 'Join Now',
          link: 'https://meet.google.com/rhm-jedy-frc',
        },
      };
      const outro = 'Need help, or have questions? Just reply to this email.';
      const htmlContent = this.generateMailContent(name, intro, outro, action);

      return this.sendMail(email, 'Class Reminder', htmlContent);
    });

    // Wait for all email-sending promises to resolve
    await Promise.all(emailPromises);
  }
}

// Usage in controllers
export const UserRegmail = async (req, res) => {
  const { email, name } = req.body;
  const emailService = new EmailService();

  try {
    await emailService.sendUserRegistrationMail(email, name);
    console.log('Email sent successfully');
  } catch (error) {
    console.log(error)
  }
};

export const CourseRegmail = async (req, res) => {
  const { email, name } = req.body;
  const emailService = new EmailService();

  try {
    await emailService.sendCourseRegistrationMail(email, name);
    return res.status(201).send('Course registration email sent');
  } catch (error) {
    return res.status(500).send('Error sending course registration email');
  }
};

export const scheduleEmail = async (req, res) => {
  const emailService = new EmailService();

  try {
    await emailService.sendScheduledEmailToAllUsers();
    return res.status(200).send('Scheduled emails sent to all users');
  } catch (error) {
    return res.status(500).send('Error sending scheduled emails');
  }
};
