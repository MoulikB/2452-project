import { PGlite } from "@electric-sql/pglite";

// idb://BadCodeClicker says to use IndexedDB as the backing storage for PGlite,
// this is "permanent" storage for us.
const pgliteDb = await PGlite.create("idb://BadCodeClicker");

export default function db() {
  return pgliteDb;
}
