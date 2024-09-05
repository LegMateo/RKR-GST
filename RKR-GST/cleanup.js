import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function cleanupOldUsers() {
  try {
    await client.connect();
    const adminDb = client.db().admin(); // Connect to the admin database to list all databases

    // List all databases in the cluster
    const { databases } = await adminDb.listDatabases();

    // Set the expiration date to 1 day ago (or any threshold you choose)
    let expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1); // 1 day ago for testing
    console.log("Expiration date for deletion (UTC):", expirationDate);

    // Iterate over all databases that match the user_* pattern
    for (const dbInfo of databases) {
      const dbName = dbInfo.name;

      if (dbName.startsWith("user_")) {
        // Only process user databases
        console.log(`Checking user database: ${dbName}`);

        const db = client.db(dbName);

        // Query the uploads.files collection for old files
        const oldFiles = await db
          .collection("uploads.files")
          .find({
            uploadDate: { $lt: expirationDate },
          })
          .toArray();

        if (oldFiles.length > 0) {
          // If old files are found, drop the entire database
          console.log(`Dropping database for user: ${dbName}`);
          await db.dropDatabase(); // This will delete the entire user database
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
