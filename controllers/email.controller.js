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
    }
  }

  async sendUserRegistrationMail(email, name) {
    const intro = 'Thank you for registering with us. We are thrilled to welcome you as a valued member of our community. Your registration was successful, and you are now part of a dynamic platform dedicated to excellence and innovation. As a member, you will have access to exclusive resources, insightful content, and a network of like-minded individuals. We are committed to providing you with the best experience possible and look forward to supporting you in your journey with us.';
    const outro = 'If you have any questions or need assistance, please do not hesitate to reach out to our support team.';
    
    const htmlContent = this.generateMailContent(name, intro, outro);
    await this.sendMail(email, 'Welcome to #GO Academy', htmlContent);
  }

  async sendCourseRegistrationMail(email, name) {
    const intro = 'Thank you for registering for our courses. We are delighted to welcome you to our esteemed community of learners and professionals. Your registration has been successfully completed, and you are now a valued member of our platform. We are committed to providing you with a rich learning experience and the support you need to achieve your educational and career goals.';
    const outro = 'If you have any questions or need assistance, please do not hesitate to reach out to our support team. We look forward to your active participation and wish you great success in your learning journey with us.';
    
    const htmlContent = this.generateMailContent(name, intro, outro);
    await this.sendMail(email, 'Welcome to #GO Academy', htmlContent);
  }

  async sendScheduledEmailToAllUsers() {
    const userInfo = await User.find({});
    for (let data of userInfo) {
      const name = data.name;
      const email = data.email;

      const intro = 'This is a reminder that our online class is scheduled to begin at 10:30 AM tonight. Please ensure you are prepared and logged in a few minutes before the start time to avoid any delays.';
      const action = {
        instructions: 'To join the class, please click the button to join the class',
        button: {
          color: '#22BC66',
          text: 'Join Now',
          link: 'https://meet.google.com/rhm-jedy-frc',
        },
      };
      const outro = 'Need help, or have questions? Just reply to this email, we\'d love to help.';

      const htmlContent = this.generateMailContent(name, intro, outro, action);
      await this.sendMail(email, 'Welcome to #GO Academy', htmlContent);
    }
  }
}

// Usage in controllers
export const UserRegmail = async (req, res) => {
  const { email, name } = req.body;
  const emailService = new EmailService();
  await emailService.sendUserRegistrationMail(email, name);
  return res.status(201).send('User registration email sent');
};

export const CourseRegmail = async (req, res) => {
  const { email, name } = req.body;
  const emailService = new EmailService();
  await emailService.sendCourseRegistrationMail(email, name);
  return res.status(201).send('Course registration email sent');
};

export const scheduleEmail = async (req, res) => {
  const emailService = new EmailService();
  await emailService.sendScheduledEmailToAllUsers();
  return res.status(200).send('Scheduled emails sent to all users');
};
