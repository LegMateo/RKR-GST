import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; // Correct import for uuid v4 function

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

async function connectToUserDB(userId) {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("Connected to MongoDB!");

    // Truncate the userId to ensure it fits within the database name length limit
    const truncatedUserId = userId.substring(0, 20); // Keeping it within a safe range
    const dbName = `user_${truncatedUserId}`;
    const db = client.db(dbName);

    // Example: Check if collections exist or create them
    const collections = await db.listCollections().toArray();
    console.log(
      `Existing collections for user ${truncatedUserId}:`,
      collections.map((c) => c.name)
    );

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Export the function to be used in other files
export { connectToUserDB };

// If the script is run directly (not imported), generate a user ID and connect
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const userId = uuidv4(); // Generate a unique user ID
  connectToUserDB(userId).then(() => {
    console.log("DB setup completed.");
  });
}
