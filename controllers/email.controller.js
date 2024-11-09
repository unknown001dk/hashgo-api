import nodemailer from "nodemailer";
import Mailgen from "mailgen";

class MailService {
  constructor() {
    this.config = {
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };
    this.transporter = nodemailer.createTransport(this.config);

    this.mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "N.S.N. COLLEGE",
        link: "https://nonametech.info",
      },
    });
  }

  generateMail(content) {
    return this.mailGenerator.generate(content);
  }

  sendMail(message) {
    return this.transporter.sendMail(message);
  }
}

class RegisterMailService  extends MailService {
  constructor() {
    super();
  }

  generateRegisterMail(req) {
    const { fullname, email, course } = req.body;

    const content = {
      body: {
        name: fullname,
        intro: `Thank you for reaching out to us at N.S.N. College of Engineering and Technology. We appreciate your interest.\n\nSelected course: ${course}`,
        outro: "Please feel free to let us know if you have any further questions.",
      },
    };

    const mail = this.generateMail(content);

    return {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: "New Message from Contact Form",
      html: mail,
    };
  }

  sendRegisterMail(req, res) {
    const message = this.generateRegisterMail(req);
    this.sendMail(message).then(() => {
      res.status(200).send({ message: "Mail sent successfully" });
    }).catch(error => {
      res.status(500).send({ message: "Failed to send registration mail", error });
    });
  }
};

export default RegisterMailService;