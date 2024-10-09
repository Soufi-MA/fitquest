import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sessionTable, userTable } from "./schema/user";

const pool = new Pool({
  connectionString:
    "postgres://postgres:014262911@localhost:5432/fitquest?sslmode=no-verify",
});
export const db = drizzle(pool);

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable
);
