import { getDb } from "./client";
import { posts, itinerariesTable, destinations } from "./schema";

async function clearDummyData() {
  const db = getDb();
  console.log("Clearing dummy data...");
  await db.delete(posts);
  await db.delete(itinerariesTable);
  await db.delete(destinations);
  console.log("Successfully cleared dummy data from DB");
  process.exit(0);
}
clearDummyData().catch(console.error);
