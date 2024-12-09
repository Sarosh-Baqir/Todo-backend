import { z } from "zod";

// Define validation schema for creating a task
const createTaskValidationSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "completed"]).default("pending"),
});

// Define validation schema for updating a task
const updateTaskValidationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").optional(),
  description: z.string().trim().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

// Define validation schema for updating task status
const updateTaskStatusValidationSchema = z.object({
  status: z.enum(["pending", "completed"]),
});

export {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  updateTaskStatusValidationSchema,
};
