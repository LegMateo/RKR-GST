import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import { Readable } from "stream";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { GridFSBucket, ObjectId } from "mongodb";
import { connectToUserDB } from "./db.js";
import { processUserTokens } from "./main.js";
import cron from "node-cron";
import { cleanupOldUsers } from "./cleanup.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Schedule the cleanup job to run every day at midnight (00:00)
cron.schedule("0 0 * * *", () => {
  // Runs at 00:00 every day
  console.log("Running daily user cleanup...");
  cleanupOldUsers(); // Call the cleanup function
});

function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

async function checkIfProcessedFileExists(userId, processedFilename) {
  const db = await connectToUserDB(userId);
  const filesCollection = db.collection("uploads.files");
  return await filesCollection.findOne({ filename: processedFilename });
}

async function runPreprocessingScript(fileId, userId) {
  return new Promise((resolve, reject) => {
    const preprocessingScriptPath = path.join(
      __dirname,
      "../tokenizer/preprocessing.py"
    );
    const preprocessingCmd = `source /Users/mateo/Desktop/Zavrsni/tokenizer/venv/bin/activate && python3 ${preprocessingScriptPath} ${userId} ${fileId}`;

    exec(preprocessingCmd, async (error, stdout, stderr) => {
      if (error) {
        console.error("Error running preprocessing script:", stderr);
        return reject(error);
      }

      let processedCode = stdout.trim();
      console.log("Processed Code:", processedCode);

      // Normalize line endings for consistency
      const normalizedContent = processedCode
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n");
      console.log("Normalized Content passed to tokenizer:", normalizedContent);

      const tokenizerPath = path.join(__dirname, "../tokenizer/tokenizer");

      const tokenizerProcess = exec(
        tokenizerPath,
        (tokenError, tokenStdout, tokenStderr) => {
          if (tokenError) {
            console.error("Error running tokenizer:", tokenStderr);
            return reject(tokenError);
          }

          const lines = tokenStdout.trim().split("\n");
          const tokens = [];
          const metadata = [];

          lines.forEach((line, index) => {
            const [token, lineNum, columnNum] = line.split(" ");
            tokens.push(token);
            metadata.push({
              line: parseInt(lineNum),
              column: parseInt(columnNum),
            });
          });

          resolve({ processedCode, tokens, metadata });
        }
      );

      tokenizerProcess.stdin.write(normalizedContent);
      tokenizerProcess.stdin.end();
    });
  });
}

// Upload Endpoint
app.post("/upload", upload.array("files"), async (req, res) => {
  console.log("Files received:", req.files);
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const userId = generateUserId();
  console.log(`Generated user ID: ${userId}`);
  const db = await connectToUserDB(userId);
  console.log(`Database connected for user ID: ${userId}`);

  let filesUploaded = [];
  let processingResults = [];
  let errors = [];

  const processFile = async (file) => {
    try {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      const bucket = new GridFSBucket(db, { bucketName: "uploads" });
      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      const fileId = await new Promise((resolve, reject) => {
        readableStream.pipe(uploadStream);
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
      });

      console.log(
        `Original file uploaded: ${file.originalname}, ID: ${fileId}`
      );
      filesUploaded.push({ filename: file.originalname, id: fileId });

      const { processedCode, tokens, metadata } = await runPreprocessingScript(
        fileId.toString(),
        userId
      );

      // Check if the processed file already exists
      const processedFilename = `p_${file.originalname}`;
      const existingProcessedFile = await checkIfProcessedFileExists(
        userId,
        processedFilename
      );

      let processedCodeId;
      if (existingProcessedFile) {
        console.log(`Processed file already exists: ${processedFilename}`);
        processedCodeId = existingProcessedFile._id;
      } else {
        // Ensure processed code is uploaded only once
        const processedCodeStream = new Readable();
        processedCodeStream.push(processedCode);
        processedCodeStream.push(null);

        const processedCodeUploadStream = bucket.openUploadStream(
          processedFilename,
          {
            contentType: "text/plain",
            metadata: { originalFileId: fileId },
          }
        );

        processedCodeId = await new Promise((resolve, reject) => {
          processedCodeStream.pipe(processedCodeUploadStream);
          processedCodeUploadStream.on("finish", () =>
            resolve(processedCodeUploadStream.id)
          );
          processedCodeUploadStream.on("error", reject);
        });

        console.log(
          `Processed file uploaded: ${processedFilename}, ID: ${processedCodeId}`
        );
      }

      // Debugging: Log processed code, tokens, and metadata before saving
      console.log("Processed Code ID:", processedCodeId);
      console.log("Tokens before saving to DB:", tokens);
      console.log("Metadata before saving to DB:", metadata);

      const tokenDocument = {
        userId,
        fileId: processedCodeId,
        text1ProcessedCodeID: processedCodeId,
        pattern1ProcessedCodeId: processedCodeId,
        tokens,
        metadata,
      };

      const tokenCollection = db.collection("tokens");
      await tokenCollection.insertOne(tokenDocument);

      processingResults.push({ id: fileId, processedCodeId: processedCodeId });
    } catch (err) {
      console.error("Error processing file:", err);
      errors.push({ id: null, error: err.message });
    }
  };

  for (let i = 0; i < req.files.length; i++) {
    await processFile(req.files[i]);
  }

  res
    .status(201)
    .json({ userId, files: filesUploaded, processingResults, errors });
});

app.get("/calculate/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await connectToUserDB(userId);
    const filesCollection = db.collection("uploads.files");

    // Process tokens and retrieve comparisons
    const results = await processUserTokens(userId);

    const processedCodeIds = new Set();

    // Collect all processed code IDs from the results
    results.comparisons.forEach((comparison) => {
      processedCodeIds.add(comparison.text1ProcessedCodeID);
      processedCodeIds.add(comparison.pattern1ProcessedCodeId);
    });

    // Retrieve the filenames for the processed code IDs
    const filesData = await filesCollection
      .find({
        _id: {
          $in: Array.from(processedCodeIds).map((id) => new ObjectId(id)),
        },
      })
      .toArray();

    const filenameMap = {};
    filesData.forEach((file) => {
      filenameMap[file._id.toString()] = file.filename;
    });

    // Update the comparisons with filenames and add metadata
    const formattedComparisons = results.comparisons.map(
      (comparison, index) => {
        const textFilename =
          filenameMap[comparison.text1ProcessedCodeID] || "Unknown Filename";
        const patternFilename =
          filenameMap[comparison.pattern1ProcessedCodeId] || "Unknown Filename";

        return {
          similarityScore: comparison.similarityScore,
          text1ProcessedCodeID: comparison.text1ProcessedCodeID,
          pattern1ProcessedCodeId: comparison.pattern1ProcessedCodeId,
          [`text${index + 1}Filename`]: textFilename,
          [`pattern${index + 1}Filename`]: patternFilename,
          textMetadata: comparison.textMetadata || [], // Add text metadata
          patternMetadata: comparison.patternMetadata || [], // Add pattern metadata
        };
      }
    );

    res.status(200).json({ userId, comparisons: formattedComparisons });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Processed Code Endpoint
app.get("/processedCode/:userId/:fileId", async (req, res) => {
  const { userId, fileId } = req.params;
  console.log(
    `Retrieving processed code for file ID ${fileId} in user DB ${userId}`
  );

  try {
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: "Invalid fileId format" });
    }

    const db = await connectToUserDB(userId);
    const objectId = new ObjectId(fileId);

    const filesCollection = db.collection("uploads.files");
    const fileDoc = await filesCollection.findOne({
      _id: objectId,
      filename: /^p_/,
    });

    if (!fileDoc) {
      return res.status(404).json({ error: "Processed file not found" });
    }

    const chunksCollection = db.collection("uploads.chunks");
    const chunks = await chunksCollection
      .find({ files_id: objectId })
      .sort({ n: 1 })
      .toArray();

    let fileData = "";
    chunks.forEach((chunk) => {
      fileData += chunk.data.toString("utf8");
    });

    res.status(200).json({ processedCode: fileData });
  } catch (error) {
    console.error("Error retrieving processed code:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
