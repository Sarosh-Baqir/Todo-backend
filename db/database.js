import mongoose from "mongoose";
import { DATABASE_URL } from "../src/utils/constants.js";

const connectDB = () => {
  return mongoose
    .connect(DATABASE_URL)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Database connection failed:", error.message);
      process.exit(1);
    });
};

export default connectDB;
