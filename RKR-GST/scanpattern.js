import { rabinKarpHash } from "./RKR.js";
import { DoublyLinkedList } from "./dataStructures.js";

function scanpattern(T, P, s, text_mark, pattern_mark) {
  console.log(`Scanning pattern with s = ${s}`);
  let currentT = T.head;
  let index = 0;
  let hashTable = {};
  let longestMatch = 0;

  const list = new DoublyLinkedList();

  while (currentT != null) {
    let text = "";
    let tempT = currentT;

    console.log(`Current T: ${tempT.data}`);
    let result = checkNextTokens(currentT, text_mark, s, index);
    currentT = result.currentT;
    index = result.index;

    if (currentT == null) {
      break;
    }
    tempT = currentT;

    for (let i = 0; i < s && tempT != null; i++) {
      text += tempT.data;
      tempT = tempT.next;
    }

    if (text.length == s) {
      let hashValue = rabinKarpHash(text, s);
      hashTable[index] = {
        hashValue: hashValue,
        startPoint: index,
      };
      console.log(`After hashing, index is: ${index}`);
      index++;
    }

    currentT = currentT.next;
  }

  let patternIndex = 0;
  let currentP = P.head;

  while (currentP != null) {
    let pattern = "";
    let tempP = currentP;

    let result = checkNextTokens(currentP, pattern_mark, s, patternIndex);
    currentP = result.currentT;
    patternIndex = result.index;

    if (currentP == null) {
      break;
    }
    tempP = currentP;

    for (let i = 0; i < s && tempP != null; i++) {
      pattern += tempP.data;
      tempP = tempP.next;
    }

    console.log(pattern);
    console.log(pattern.length);

    if (pattern.length == s) {
      console.log(`Pattern je tu`);
      let patternHash = rabinKarpHash(pattern, s);

      for (let key in hashTable) {
        if (hashTable[key].hashValue === patternHash) {
          let matchStart = hashTable[key].startPoint;
          let currentNode = T.head;
          for (let i = 0; i < matchStart; i++) {
            currentNode = currentNode.next;
          }

          let matchedText = "";
          for (let i = 0; i < s; i++) {
            matchedText += currentNode.data;
            currentNode = currentNode.next;
          }

          console.log(
            `Checking match at text index ${matchStart} with pattern index ${patternIndex}`
          );

          if (
            isMarked(matchStart, text_mark, s) ||
            isMarked(patternIndex, pattern_mark, s)
          ) {
            console.log(
              `Tokens are marked, skipping match at text index ${matchStart} and pattern index ${patternIndex}`
            );
            continue;
          }

          if (matchedText === pattern) {
            let k = s;
            let tempNode = currentNode;
            let tempPattern = tempP;

            while (
              tempNode != null &&
              tempPattern != null &&
              tempNode.data === tempPattern.data
            ) {
              k++;
              tempNode = tempNode.next;
              tempPattern = tempPattern.next;

              if (tempNode == null || tempPattern == null) {
                break;
              }
            }

            if (k > 2 * s) {
              console.log(`Recursively calling scanpattern with k = ${k}`);
              return scanpattern(T, P, k, text_mark, pattern_mark);
            } else {
              console.log(
                `Exact match found at text index ${matchStart} and pattern index ${patternIndex} ${matchedText} === ${pattern}`
              );

              if (k > longestMatch) {
                longestMatch = k;
                console.log(`New maximal match recorded: ${k}`);
              }
              const node = list.find(k);
              if (node) {
                node.matches.push({ p: patternIndex, t: matchStart, s: k });
              } else {
                list.insert(k, { p: patternIndex, t: matchStart, s: k });
              }
            }
          } else {
            console.log(
              `Hash collision at text index ${matchStart} and pattern index ${patternIndex}`
            );
          }
        }
      }
    }

    currentP = currentP.next;
    patternIndex++;
  }

  console.log(`Hash table: ${JSON.stringify(hashTable)}`);
  list.printList();
  console.log(`Longest match: ${longestMatch}`);
  return { longestMatch, list };
}

function isMarked(index, markArray, s) {
  if (index < 0 || index + s > markArray.length) {
    console.log(`Index: ${index}, Out of bounds`);
    return false;
  }

  for (let i = index; i < index + s; i++) {
    if (markArray[i]) {
      console.log(`Index: ${i}, Value: ${markArray[i]}`);
      return true;
    }
  }

  console.log(`Index: ${index} to ${index + s - 1}, All values are false`);
  return false;
}

function checkNextTokens(currentT, markArray, s, currentIndex) {
  console.log(`Checking next tokens with s = ${s}`);

  let index = currentIndex;
  let tempT = currentT;

  let isMarked = false;
  for (let i = 0; i < s && tempT != null; i++) {
    if (markArray[index + i]) {
      isMarked = true;
      console.log(`Token at index ${index + i} is marked`);
      break;
    }
    tempT = tempT.next;
  }

  if (isMarked) {
    let nextUnmarkedIndex = index + s;
    while (
      nextUnmarkedIndex < markArray.length &&
      markArray[nextUnmarkedIndex]
    ) {
      nextUnmarkedIndex++;
    }
    console.log(`Skipping from index ${index} to index ${nextUnmarkedIndex}`);
    if (nextUnmarkedIndex - index <= s) {
      for (let i = index; i < nextUnmarkedIndex && currentT != null; i++) {
        currentT = currentT.next;
      }
      index = nextUnmarkedIndex;
      console.log(`Returning to index ${index} with currentT after skipping`);
    } else if (nextUnmarkedIndex >= markArray.length) {
      currentT = null;
      index = markArray.length;
    } else {
      for (let i = index; i < nextUnmarkedIndex && currentT != null; i++) {
        currentT = currentT.next;
      }
      index = nextUnmarkedIndex;
    }
  }

  console.log(
    `No marked tokens found from index ${index} to index ${index + s - 1}`
  );

  return { currentT, index };
}

export default scanpattern;
