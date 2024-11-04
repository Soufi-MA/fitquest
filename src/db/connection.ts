import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgres://postgres:014262911@localhost:5432/fitquest?sslmode=no-verify",
});
export const db = drizzle(pool);
