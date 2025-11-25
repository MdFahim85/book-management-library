import { config } from "dotenv";

config();

export default {
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  dbPassword: process.env.DB_PASSWORD,
  dbUser: process.env.DB_USER,
  dbURL: process.env.DB_URL,
  port: parseInt(process.env.PORT) || 3000,
  isProduction: process.env.NODE_ENV === "production",
};
