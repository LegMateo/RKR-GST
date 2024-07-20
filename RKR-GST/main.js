import scanpattern from "./scanpattern.js";
import markarrays from "./markarrays.js";
import fs from "fs";

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
    console.log(output);
  }
}

async function readTokensFromFile(filePath) {
  try {
    const tokenFileContent = await fs.promises.readFile(filePath, "utf8");
    const tokenArray = tokenFileContent.trim().split(/\s+/);
    return tokenArray;
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

function convertArrayToList(array) {
  const list = new DoublyLinkedList();
  array.forEach((token) => {
    list.append(token);
  });
  return list;
}

async function main() {
  const textTokenPath =
    "/Users/mateo/Desktop/tokenizer/tokens_tokens_20240720103849.txt"; // text
  const patternTokenPath =
    "/Users/mateo/Desktop/tokenizer/tokens_tokens_20240720103856.txt"; // Pattern

  const textTokenArray = await readTokensFromFile(textTokenPath);
  const patternTokenArray = await readTokensFromFile(patternTokenPath);

  const textTokenList = convertArrayToList(textTokenArray);
  const patternTokenList = convertArrayToList(patternTokenArray);

  console.log("Text Tokens:");
  textTokenList.print();
  console.log("Pattern Tokens:");
  patternTokenList.print();

  const text_mark = Array(textTokenArray.length).fill(false);
  const pattern_mark = Array(patternTokenArray.length).fill(false);

  let s = 20; // Currently 20
  const minimumMatchLength = 3;
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
        `Recursively calling scanpattern with k = ${Lmax.longestMatch}`
      );
      s = Lmax.longestMatch;
    } else {
      markarrays(s, Lmax.list, pattern_mark, text_mark);
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
}

main();
