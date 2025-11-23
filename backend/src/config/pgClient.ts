import { Client } from "pg";

import env from "./env";

export default new Client({
  user: env.dbUser,
  password: env.dbPassword,
  host: env.dbHost,
  port: parseInt(env.dbPort) || 5432,
  database: env.dbName,
});
