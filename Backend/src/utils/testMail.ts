// testMail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

transport.sendMail({
  from: "test@mail.com",
  to: "receiver@email.com",
  subject: "Test Email",
  text: "Hello from Mailtrap!",
})
  .then(() => console.log("Email sent ✅"))
  .catch((err) => console.error("Error ❌", err));
