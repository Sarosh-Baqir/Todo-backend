import express from "express";
import {
  createTask,
  updateTask,
  getTaskById,
  getTasksByUser,
  deleteTask,
} from "../controllers/taskController.js";
import {
  createTaskValidationSchema,
  updateTaskValidationSchema,
} from "../validation_schemas/task.validation.schema.js";
import { validationMiddleware } from "../middlewares/validation_middleware.js";
import authentication from "../middlewares/auth_middleware.js";

const router = express.Router();

// Route to create a task
router.post(
  "/create",
  authentication,
  validationMiddleware(createTaskValidationSchema, (req) => req.body),
  createTask
);

// Route to update a task
router.put(
  "/update/:taskId",
  authentication,
  validationMiddleware(updateTaskValidationSchema, (req) => ({
    ...req.body,
    taskId: req.params.taskId,
  })),
  updateTask
);

// Route to get a task by ID
router.get("/:taskId", authentication, getTaskById);

// Route to get all tasks
router.get("/", authentication, getTasksByUser);

// Route to delete a task
router.delete("/delete/:taskId", authentication, deleteTask);

export default router;
