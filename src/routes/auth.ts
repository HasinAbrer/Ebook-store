import {
  generateAuthLink,
  logout,
  sendProfileInfo,
  updateProfile,
  verifyAuthToken,
} from "src/controllers/auth";
import {
  emailValidationSchema,
  newUserSchema,
  validate,
} from "src/middlewares/validator";
import { Router } from "express";
import { isAuth } from "src/middlewares/auth";
import { fileParser } from "src/middlewares/file";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);
authRouter.post("/logout", isAuth, logout);
authRouter.put(
  "/profile",
  isAuth,
  fileParser,
  validate(newUserSchema),
  updateProfile
);

export default authRouter;
