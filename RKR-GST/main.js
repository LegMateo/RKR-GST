import scanpattern from "./scanpattern.js";
import markarrays from "./markarrays.js";
import dotenv from "dotenv";
import { connectToUserDB } from "./db.js";
import { ObjectId } from "mongodb";

dotenv.config();

class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  print() {
    let current = this.head;
    let output = "";
    while (current) {
      output += current.data + " ";
      current = current.next;
    }
  }
}

function convertArrayToList(array) {
  const list = new DoublyLinkedList();
  array.forEach((token) => {
    list.append(token);
  });
  return list;
}

function filterMetadataByMark(markArray, metadataArray) {
  return metadataArray
    .filter((_, index) => markArray[index])
    .map(({ line, column }) => ({ line, column }));
}

export async function processUserTokens(userId) {
  try {
    const db = await connectToUserDB(userId);
    const tokensCollection = db.collection("tokens");
    const filesCollection = db.collection("uploads.files");

    const tokenDocuments = await tokensCollection.find({ userId }).toArray();

    if (tokenDocuments.length === 0) {
      console.log("No tokens data found in the database.");
      return { tokensData: [], comparisons: [] };
    }

    const comparisons = [];
    let comparisonCount = 1;

    const fileIdToFilenameMap = {};
    const processedCodeIds = tokenDocuments.map(
      (doc) => doc.text1ProcessedCodeID
    );

    const filesData = await filesCollection
      .find({
        _id: {
          $in: processedCodeIds.map((id) => new ObjectId(id)),
        },
      })
      .toArray();

    filesData.forEach((file) => {
      fileIdToFilenameMap[file._id.toString()] = file.filename;
    });

    for (let i = 0; i < tokenDocuments.length - 1; i++) {
      for (let j = i + 1; j < tokenDocuments.length; j++) {
        let textDoc = tokenDocuments[i];
        let patternDoc = tokenDocuments[j];

        if (patternDoc.tokens.length > textDoc.tokens.length) {
          [textDoc, patternDoc] = [patternDoc, textDoc];
        }

        const textTokens = textDoc.tokens;
        const patternTokens = patternDoc.tokens;

        const textTokenList = convertArrayToList(textTokens);
        const patternTokenList = convertArrayToList(patternTokens);

        const text_mark = Array(textTokens.length).fill(false);
        const pattern_mark = Array(patternTokens.length).fill(false);

        let s = 20;
        const minimumMatchLength = 5;
        let count = 1;

        let stop = false;

        while (!stop) {
          console.log(text_mark, pattern_mark);

          let Lmax = scanpattern(
            textTokenList,
            patternTokenList,
            s,
            text_mark,
            pattern_mark
          ); // Lmax  = largest maximal-matches found
          console.log(`Lmax = ${Lmax.longestMatch} `);
          console.log("S is: " + s);
          if (Lmax.longestMatch > 2 * s) {
            console.log(
              `IN MAIN Recursively calling scanpattern with k = ${Lmax.longestMatch}`
            );
            s = Lmax.longestMatch;
          } else {
            markarrays(s, Lmax.list, pattern_mark, text_mark);
            // console.log(JSON.stringify("TEXT" + text_mark, null, 2));
            // console.log(JSON.stringify("PATTERN" + pattern_mark, null, 2));
            if (s > 2 * minimumMatchLength) {
              s = Math.floor(s / 2);
              count++;
              console.log(`Iteration number: ${count}`);
            } else if (s > minimumMatchLength) {
              s = minimumMatchLength;
              count++;
              console.log(`Iteration number: ${count}`);
            } else {
              stop = true;
            }
          }
        }

        const filteredTextMetadata = filterMetadataByMark(
          text_mark,
          textDoc.metadata
        );
        const filteredPatternMetadata = filterMetadataByMark(
          pattern_mark,
          patternDoc.metadata
        );

        let totalMatchingLength = text_mark.filter(Boolean).length;

        const similarityScore = (
          ((2 * totalMatchingLength) /
            (textTokens.length + patternTokens.length)) *
          100
        ).toFixed(4);

        const tokenDocumentUpdate = {
          userId,
          text1ProcessedCodeID: textDoc.text1ProcessedCodeID,
          pattern1ProcessedCodeId: patternDoc.text1ProcessedCodeID,
          similarityScore,
          textMetadata: filteredTextMetadata,
          patternMetadata: filteredPatternMetadata,
        };

        await tokensCollection.updateOne(
          {
            text1ProcessedCodeID: textDoc.text1ProcessedCodeID,
            pattern1ProcessedCodeId: patternDoc.text1ProcessedCodeID,
          },
          { $set: tokenDocumentUpdate },
          { upsert: true }
        );

        comparisons.push({
          similarityScore,
          text1ProcessedCodeID: textDoc.text1ProcessedCodeID,
          pattern1ProcessedCodeId: patternDoc.text1ProcessedCodeID,
          [`text${comparisonCount}Filename`]:
            fileIdToFilenameMap[textDoc.text1ProcessedCodeID],
          [`pattern${comparisonCount}Filename`]:
            fileIdToFilenameMap[patternDoc.text1ProcessedCodeID],
          textMetadata: filteredTextMetadata,
          patternMetadata: filteredPatternMetadata,
        });

        comparisonCount++;
      }
    }

    console.log("All comparisons completed.");

    await tokensCollection.deleteMany({
      userId,
      similarityScore: { $exists: false },
    });

    console.log("Old tokens removed.");

    return { comparisons };
  } catch (error) {
    console.error("Error in processUserTokens function:", error);
    throw error;
  }
}
