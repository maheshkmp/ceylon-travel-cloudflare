import { getDb } from "./client";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Dropping courses, course_instructors, chapters, lessons tables CASCADE...");
  const db = getDb();
  
  // Execute CASCADE drops on tables
  await db.execute(sql`DROP TABLE IF EXISTS courses CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS course_instructors CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS chapters CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS lessons CASCADE;`);
  
  // Execute CASCADE drops on old enums/types to avoid push dependency blocks
  console.log("Dropping custom types/enums CASCADE...");
  await db.execute(sql`DROP TYPE IF EXISTS course_status CASCADE;`);
  await db.execute(sql`DROP TYPE IF EXISTS org_member_role CASCADE;`);
  await db.execute(sql`DROP TYPE IF EXISTS plan CASCADE;`);
  await db.execute(sql`DROP TYPE IF EXISTS role CASCADE;`);

  console.log("Tables and custom types dropped successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to drop tables:", err);
  process.exit(1);
});
