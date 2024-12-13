import express from "express";
import {
  registerUser,
  verifyUser,
  getOTP,
  verifyOTP,
  login,
  resetPassword,
  updatePassword,
  logOut,
} from "../controllers/userController.js";
import {
  registerUserValidationSchema,
  verifyUserValidationSchema,
  getOTPValidationSchema,
  verifyOtpValidationSchema,
  loginValidationSchema,
  updatePasswordValidationSchema,
  resetPasswordValidationSchema,
} from "../validation_schemas/user.validation.schemas.js";
import { checkUserAlreadyRegistered } from "../middlewares/avoid_duplicates.js";
import { validationMiddleware } from "../middlewares/validation_middleware.js";
import authentication from "../middlewares/auth_middleware.js";
import upload from "../utils/multer.js";
const router = express.Router();

router.post(
  "/register",
  upload.single("profile_image"),
  validationMiddleware(registerUserValidationSchema, (req) => req.body),
  checkUserAlreadyRegistered,
  registerUser
);
router.post(
  "/verify-user",
  validationMiddleware(verifyUserValidationSchema, (req) => req.body),
  verifyUser
);

router.get(
  "/get-otp/:email",
  validationMiddleware(getOTPValidationSchema, (req) => req.params),
  getOTP
);

router.post(
  "/verify-otp",
  validationMiddleware(verifyOtpValidationSchema, (req) => req.body),
  verifyOTP
);

router.post(
  "/login",
  validationMiddleware(loginValidationSchema, (req) => req.body),
  login
);

router.post(
  "/update-password",
  authentication,
  validationMiddleware(updatePasswordValidationSchema, (req) => req.body),
  updatePassword
);
router.post(
  "/forget-password",
  validationMiddleware(resetPasswordValidationSchema, (req) => req.body),
  resetPassword
);

router.post("/logout", authentication, logOut);

export default router;
