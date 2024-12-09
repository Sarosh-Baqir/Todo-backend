import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const {
  SERVER_PORT,
  SERVER_HOST,
  DATABASE_URL,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_NAME,
  JWT_PRIVATE_KEY,
  JWT_EXPIRATION_TIME,
} = process.env;
