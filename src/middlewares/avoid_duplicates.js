import User from "../../db/schema/user.js";
import { errorResponse } from "../utils/response.handle.js";

// Middleware to check if user is already registered
const checkUserAlreadyRegistered = async (req, res, next) => {
  try {
    const { email } = req.body;
    const data = await User.findOne({ email });

    if (data) {
      return errorResponse(
        res,
        "user with this Email is already Registered",
        409
      );
    }
    next();
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export { checkUserAlreadyRegistered };
