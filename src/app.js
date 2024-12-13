import dotenv from "dotenv";
import express from "express";
import connectDB from "../db/database.js";
import cors from "cors";
import { SERVER_HOST, SERVER_PORT } from "./utils/constants.js";
import routes from "../src/routes/index.js";
dotenv.config({ path: ".env" });

const app = express();
app.use(cors());

app.use(express.static("public"));
app.use(express.json());
app.use("/api", routes);
// Example route
app.get("/", (req, res) => {
  res.send("Welcome to Express with Drizzle ORM!");
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on http://${SERVER_HOST}:${SERVER_PORT}`);
});
connectDB();
