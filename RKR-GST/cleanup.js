import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function cleanupOldUsers() {
  try {
    await client.connect();
    const adminDb = client.db().admin();

    const { databases } = await adminDb.listDatabases();

    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1);
    console.log("Expiration date for deletion (UTC):", expirationDate);

    for (const dbInfo of databases) {
      const dbName = dbInfo.name;

      if (dbName.startsWith("user_")) {
        console.log(`Checking user database: ${dbName}`);

        const db = client.db(dbName);

        const oldFiles = await db
          .collection("uploads.files")
          .find({
            uploadDate: { $lt: expirationDate },
          })
          .toArray();

        if (oldFiles.length > 0) {
          console.log(`Dropping database for user: ${dbName}`);
          await db.dropDatabase();
          console.log(`Database ${dbName} has been dropped.`);
        } else {
          console.log(`No old files found for user: ${dbName}`);
        }
      }
    }

    console.log("User cleanup completed.");
  } catch (error) {
    console.error("Error cleaning up old users:", error);
  } finally {
    await client.close();
  }
}
