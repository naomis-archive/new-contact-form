const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/contact", (req, res) => {
  const smtpTrans = nodemailer.createTransport({
    host: "smpt.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });
  const mailOpts = {
    from: "contact form",
    to: GMAIL_USER,
    subject: req.body.subject,
    text: `Dear Nicholas, \n You have received the following message from ${req.body.name}: \n ${req.body.message} \n Reply to them at ${req.body.email}`,
  };
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.json({ Error: "Failed to send message" });
    } else {
      res.json({ Success: "Message sent!" });
    }
  });
});
