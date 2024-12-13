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

router.post(
  "/create",
  authentication,
  validationMiddleware(createTaskValidationSchema, (req) => req.body),
  createTask
);

router.put(
  "/update/:taskId",
  authentication,
  validationMiddleware(updateTaskValidationSchema, (req) => ({
    ...req.body,
    taskId: req.params.taskId,
  })),
  updateTask
);

router.get("/:taskId", authentication, getTaskById);

router.get("/", authentication, getTasksByUser);

router.delete("/delete/:taskId", authentication, deleteTask);

export default router;
