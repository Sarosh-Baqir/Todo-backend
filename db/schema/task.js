import mongoose from "mongoose";
import { randomUUID } from "crypto";

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: "UUID",
      default: () => randomUUID(),
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    due_date: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    userId: {
      type: "UUID",
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
