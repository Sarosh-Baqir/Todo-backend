import User from "../../db/schema/user.js";
import BlacklistedToken from "../../db/schema/blacklistToken.js";
import bcrypt from "bcrypt";
import {
  createOTP,
  createJWTToken,
  getToken,
  verifyToken,
} from "../utils/helper.js";
import {
  successResponse,
  errorResponse,
  unauthorizeResponse,
} from "../utils/response.handle.js";
import sendEmail from "../utils/sendEmail.js";

// API to register a new user
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, gender } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = createOTP();

    // Create the new user using User.create()
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      gender,
      otp,
      is_verified: false,
    });

    // Send an email with the OTP
    try {
      await sendEmail(
        "Registration Request",
        `Hello ${first_name}`,
        `<h1>Hello ${first_name} ${last_name}</h1>
        <p>Thank you for registering with us!</p>
        <p>Your OTP for registration is <strong>${otp}</strong>.</p>`,
        email
      );

      return successResponse(
        res,
        "User Registered Successfully! An email has been sent with OTP to your provided email.",
        { userId: newUser.id }
      );
    } catch (emailError) {
      return errorResponse(
        res,
        `User created but error in sending email = ${emailError.message}`,
        400
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// After Registration Verify the User
const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "User Not Found", 404);
    }

    // Check if the user is already verified
    if (user.is_verified) {
      return errorResponse(res, "User is Already Verified", 400);
    }

    // Validate OTP
    if (otp !== user.otp) {
      return errorResponse(res, "Invalid OTP!", 400);
    }

    try {
      // Send email to the user
      await sendEmail(
        "Account Verification",
        `Hello ${user.first_name}`,
        `<h1>Hello ${user.first_name} ${user.last_name}</h1><h3>Hurray! Congratulations.</h3><p>Your account has been verified. Now you can login to the system.</p>`,
        user.email
      );

      // Update user document to set is_verified to true and clear OTP
      user.is_verified = true;
      user.otp = null;

      // Save the updated user document
      await user.save();

      return successResponse(res, "User verified successfully!", user.email);
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get Otp
const getOTP = async (req, res) => {
  try {
    const { email } = req.params;

    // Find the user by email
    const data = await User.findOne({ email: email });
    if (!data) {
      return errorResponse(res, "User Not Found", 404);
    }

    const newOtp = createOTP();

    try {
      // Send OTP email
      // await sendEmail(
      //   "New OTP Request",
      //   `Hello ${data.first_name}`,
      //   `<h1>Hello ${data.first_name} ${data.last_name}</h1><p>You requested a new OTP!</p><p>Your OTP is <strong>${newOtp}</strong>.</p>`,
      //   data.email
      // );

      // Update the user's OTP in the database
      data.otp = newOtp;
      await data.save();

      return successResponse(res, "OTP sent successfully!", newOtp);
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email = ${error.message}`,
        400
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const data = await User.findOne({ email: email });
    if (!data) {
      return errorResponse(res, "User Not Found", 404);
    }

    // Check if the OTP matches
    if (otp !== data.otp) {
      return errorResponse(res, "Invalid OTP", 400);
    }

    // Clear the OTP once it's verified
    data.otp = null;
    await data.save();

    return successResponse(res, "OTP verified successfully!", email);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// API for loggingIn
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const data = await User.findOne({ email: email });
    if (!data) {
      return unauthorizeResponse(res, "User not Registered!");
    }

    // Check if the user is verified
    if (!data.is_verified) {
      return errorResponse(res, "User not verified", 403);
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return unauthorizeResponse(res, "Credentials are Wrong!");
    }

    // Create a JWT token
    const token = await createJWTToken(data.id);
    console.log("in login: ", token);

    return successResponse(res, "Login Successfully", { data, token });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ id: req.loggedInUserId });

    if (!user) {
      return errorResponse(res, "User not found!", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, "Old Password is incorrect!", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      // await sendEmail(
      //   "Password Updated Successfully!",
      //   `Hello ${user.first_name}`,
      //   `<h1>Hello ${user.first_name} ${user.last_name}</h1><p>Your password has been updated for ${user.email}!</p>`,
      //   user.email
      // );

      user.password = hashedPassword;
      await user.save();

      return successResponse(
        res,
        "Password updated successfully, and email has been sent."
      );
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email: ${error.message}`,
        400
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, "User not found!", 404);
    }

    if (!user.is_verified) {
      return errorResponse(res, "Account is not verified", 403);
    }

    if (user.otp !== otp) {
      return errorResponse(res, "Invalid OTP!", 400);
    }

    const isSameAsCurrentPassword = await bcrypt.compare(
      newPassword,
      user.password
    );
    if (isSameAsCurrentPassword) {
      return errorResponse(
        res,
        "New password cannot be the same as the previous password.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      await sendEmail(
        "Password Reset Successfully!",
        `Hello ${user.first_name}`,
        `<h1>Hello ${user.first_name} ${user.last_name}</h1><p>Your password has been reset for ${user.email}!</p>`,
        user.email
      );

      user.password = hashedPassword;
      user.otp = null; // Clear OTP after successful reset
      await user.save();

      return successResponse(res, "Password reset successfully.");
    } catch (error) {
      return errorResponse(
        res,
        `Error in sending email: ${error.message}`,
        400
      );
    }
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const logOut = async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) {
      return unauthorizeResponse(res, "Authentication token is required.");
    }

    const decodedToken = verifyToken(token);

    const blacklistedToken = new BlacklistedToken({
      token,
      expire_time: decodedToken.exp,
    });
    await blacklistedToken.save();

    return successResponse(res, "Logged out successfully.");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export {
  registerUser,
  verifyUser,
  getOTP,
  verifyOTP,
  login,
  updatePassword,
  resetPassword,
  logOut,
};
