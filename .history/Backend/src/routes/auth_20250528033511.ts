import {
  generateAuthLink,
  logout,
  sendProfileInfo,
  verifyAuthToken,
} from '@/controllers/auth';;
import { emailValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";
import { isAuth } from "@/middlewares/auth";

const authRouter = Router();

//authRouter.post(
  //"/generate-link",
  //validate(emailValidationSchema),
  //generateAuthLink
//);

// In your magic link sending endpoint
router.post('/send-magic-link', async (req, res) => {
  const { email } = req.body;

  // 1. Generate token
  const token = crypto.randomBytes(32).toString('hex');

  // 2. Construct FULL verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/verify-token?token=${token}&userId=${user._id}`;

  // 3. Send email (using Nodemailer example)
  await transporter.sendMail({
    to: email,
    subject: 'Your Login Link',
    html: `<p>Click <a href="${verificationUrl}">here</a> to login</p>`
  });

  res.json({ success: true });
});
authRouter.get('/verify-token', (req, res) => {
  const { token, userId } = req.query;

  // Verify token logic...

  // Redirect to frontend after verification
  res.redirect('http://localhost:5000/dashboard');
});

authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);

export default authRouter;
