import BlacklistToken from "../../db/schema/blacklistToken.js";
import User from "../../db/schema/user.js";
import { getToken, verifyToken } from "../utils/helper.js";
import {
  unauthorizeResponse,
  errorResponse,
} from "../utils/response.handle.js";

const authentication = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return unauthorizeResponse(res, "Authentication token is required");
    }

    const invalidToken = await BlacklistToken.findOne({ token });
    if (invalidToken) {
      return unauthorizeResponse(res, "Unauthorized! Invalid Token");
    }

    let decodedToken;

    try {
      decodedToken = verifyToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return unauthorizeResponse(res, "Token has expired");
      } else {
        return unauthorizeResponse(res, "Invalid token");
      }
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return unauthorizeResponse(res, "Unauthorized! User not found");
    }

    req.loggedInUserId = user.id;
    next();
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export default authentication;
