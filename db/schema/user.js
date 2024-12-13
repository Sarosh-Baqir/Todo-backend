import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 255,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    otp: {
      type: String,
      maxlength: 6,
    },
    cnic: {
      type: String,
      maxlength: 15,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
