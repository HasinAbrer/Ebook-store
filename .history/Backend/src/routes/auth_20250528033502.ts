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
);

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
