import Task from "../../db/schema/task.js";
import User from "../../db/schema/user.js";
import { successResponse, errorResponse } from "../utils/response.handle.js";

// API to create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority, status } = req.body;
    const userId = req.loggedInUserId;

    // Create a new task
    const newTask = await Task.create({
      title,
      description,
      due_date,
      priority,
      status,
      userId,
    });

    return successResponse(res, "Task created successfully", newTask);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// API to get all tasks for a user
const getTasksByUser = async (req, res) => {
  try {
    const userId = req.loggedInUserId;

    // Find tasks by userId
    const tasks = await Task.find({ userId });

    if (!tasks || tasks.length === 0) {
      return errorResponse(res, "No tasks found for this user", 404);
    }

    return successResponse(res, "Tasks fetched successfully", tasks);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// API to get a specific task by its ID
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find task by taskId
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return errorResponse(res, "Task not found", 404);
    }

    return successResponse(res, "Task fetched successfully", task);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, due_date, priority, status } = req.body;
    console.log(taskId);
    // Find task by custom `id` field and update it
    const updatedTask = await Task.findOneAndUpdate(
      { id: taskId }, // Query using the `id` field, not `_id`
      { title, description, due_date, priority, status },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return errorResponse(res, "Task not found", 404);
    }

    return successResponse(res, "Task updated successfully", updatedTask);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

//delete task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find task by custom `id` field and delete it
    const deletedTask = await Task.findOneAndDelete({ id: taskId });
    if (!deletedTask) {
      return errorResponse(res, "Task not found", 404);
    }

    return successResponse(res, "Task deleted successfully", deletedTask);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export { createTask, getTasksByUser, getTaskById, updateTask, deleteTask };