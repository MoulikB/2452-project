import { PGlite } from "@electric-sql/pglite";
import ddl from "../../create-tables.sql?raw";

const dbUrl =
  import.meta.env.MODE === "test"
    ? "memory://"
    : import.meta.env.VITE_DATABASE_URL;

console.log(`Using ${dbUrl} for database URL`);

const pgliteDb = await PGlite.create(dbUrl);

if (dbUrl === "memory://") {
  // load schema for tests
  await pgliteDb.exec(ddl);
}

export default function db() {
  return pgliteDb;
}
