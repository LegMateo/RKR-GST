import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URI;
const dbName = "test";

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fetchTokens() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const filesCollection = db.collection("uploads.files");
    const chunksCollection = db.collection("uploads.chunks");

    // Fetch all token files
    const tokenFiles = await filesCollection
      .find({ filename: /_tokens\.txt$/ })
      .toArray();

    console.log("Tokens files found in DB:", tokenFiles);

    for (const file of tokenFiles) {
      const chunks = await chunksCollection
        .find({ files_id: file._id })
        .sort({ n: 1 })
        .toArray();
      let fileData = "";
      chunks.forEach((chunk) => {
        fileData += chunk.data.toString("utf8");
      });

      console.log(`Tokens for file ${file.filename}:`, fileData.trim());
    }
  } catch (error) {
    console.error("Error fetching tokens from DB:", error);
  } finally {
    await client.close();
  }
}

fetchTokens();
