import {
  generateAuthLink,
  logout,
  sendProfileInfo,
  verifyAuthToken,
} from '@/controllers/auth';;
import { emailValidationSchema, validate } from "Backend/src/middlewares/validator";
import { Router } from "express";
import { isAuth } from "Backend/src/middlewares/auth";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);

export default authRouter;
