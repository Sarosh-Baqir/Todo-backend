import mongoose from "mongoose";
import { randomUUID } from "crypto";

const blackListTokenSchema = new mongoose.Schema({
  id: {
    type: "UUID",
    default: () => randomUUID(),
    required: true,
  },
  token: {
    type: String,
    required: true,
    maxlength: 255,
  },
  expire_time: {
    type: Number,
    required: true,
  },
});

// Create a model using the schema
const BlacklistToken = mongoose.model("BlacklistToken", blackListTokenSchema);

export default BlacklistToken;
