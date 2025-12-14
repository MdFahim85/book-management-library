import { config } from "dotenv";

config();

export default {
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: parseInt(process.env.DB_PORT) || 5432,
  dbName: process.env.DB_NAME || "demo",
  dbPassword: process.env.DB_PASSWORD,
  dbUser: process.env.DB_USER,
  port: parseInt(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  isProduction: process.env.NODE_ENV === "production",
};
