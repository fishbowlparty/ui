import path from "path";
import marv from "marv/api/promise";
import driver from "marv-pg-driver";
import { CONFIG } from "../config";

export async function migrate() {
  const directory = path.resolve("migrations");
  const migrations = await marv.scan(directory);

  const connection = {
    connectionString: CONFIG.DATABASE_URL,
  };
  await marv.migrate(migrations, driver({ connection }));
}
