const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const USER = process.env.USER;
const PASS = process.env.PASS;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.post("/contact", (req, res) => {
  const smtpTrans = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: USER,
      pass: PASS,
    },
  });
  const mailOpts = {
    from: "contact@em9176.nhcarrigan.com",
    to: GMAIL_USER,
    subject: req.body.subject,
    text: `Dear Nicholas, \n ${req.body.message} \n Sincerely, \n ${req.body.name} \n ${req.body.email}`,
  };

  const validateOpts = {
    from: "noreply@em9176.nhcarrigan.com",
    to: req.body.email,
    subject: "Contact",
    text: `Dear ${req.body.name}, \n Thank you for reaching out to us! Your message has been received, and we will be in touch as soon as possible. \n Sincerely, \n Nicholas Carrigan`,
  };
  let valid = true;
  smtpTrans.sendMail(validateOpts, (error, response) => {
    if (error) {
      valid = false;
      res.json({
        Error:
          "The email address you provided appears to be invalid. Please try again.",
      });
    }
  });
  if (!valid) return;
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      console.log(error);
      res.json({ Error: error.message });
    } else {
      res.json({ Success: "Message sent!" });
    }
  });
});

const appUrl = process.env.PUBLIC_URL || "localhost";
const appPort = process.env.PORT || "3000";

app.listen(appPort, () => {
  console.log(`App is listening on ${appUrl}:${appPort}`);
});
