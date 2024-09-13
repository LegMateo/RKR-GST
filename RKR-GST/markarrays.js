import { DoublyLinkedList } from "./dataStructures.js";
import { Node } from "./dataStructures.js";
import { mark_tokens, occluded } from "./RKR.js";

function markarrays(s, doublyLinkedList, pattern_mark, text_mark) {
  let length_of_tokens_tiled = 0;
  let match = null;

  while (!doublyLinkedList.isEmpty()) {
    let currentQueue = doublyLinkedList.head;

    // If the current queue is empty, drop to the next queue
    while (currentQueue && currentQueue.isEmpty()) {
      doublyLinkedList.shift();
      currentQueue = doublyLinkedList.head;
    }

    if (currentQueue) {
      match = currentQueue.dequeue();
    }

    let occlusionResult = occluded(match, pattern_mark, text_mark);
    console.log(
      `Ocluded tokens: ${occlusionResult.occludedTokens}, IsOcluded: ${occlusionResult.isOccluded}`
    );

    if (!occlusionResult.isOccluded) {
      console.log("Marking tokens: " + match.p, match.t, match.s);
      mark_tokens(match, pattern_mark, text_mark);

      length_of_tokens_tiled += match.s;
    } else if (match.s - occlusionResult.occludedTokens >= s / 2) {
      let unmarkedPortion = {
        length: match.s - occlusionResult.occludedTokens,
        matches: [
          {
            p: match.p, // Start from the original start of the match
            t: match.t, // Start from the original start of the match
            s: match.s - occlusionResult.occludedTokens, // Reduce the size by the number of occluded tokens
          },
        ],
      };
      doublyLinkedList.insert(
        unmarkedPortion.length,
        unmarkedPortion.matches[0]
      );
      console.log(
        `Reinserting unmarked portion: length = ${unmarkedPortion.length}, p = ${unmarkedPortion.matches[0].p}, t = ${unmarkedPortion.matches[0].t}, s = ${unmarkedPortion.matches[0].s}`
      );
    } else {
      console.log(
        `Unmarked portion too small to reinsert: ${
          match.s - occlusionResult.occludedTokens
        }`
      );
    }
  }

  console.log(`Final Text Mark: ${text_mark}`);
  console.log(`Final Pattern Mark: ${pattern_mark}`);
  console.log(`Length of tokens tiled: ${length_of_tokens_tiled}`);
}
export default markarrays;
