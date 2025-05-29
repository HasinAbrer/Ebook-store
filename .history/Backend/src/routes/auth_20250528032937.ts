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

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);

// Example verification endpoint
router.get('/verify-token', async (req, res) => {
  const { token } = req.query;
  // Verify token logic...
  res.redirect('http://localhost:3000/dashboard');
});

authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);

export default authRouter;
