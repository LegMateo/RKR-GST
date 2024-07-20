import { DoublyLinkedList } from "./dataStructures.js";
import { Node } from "./dataStructures.js";
import { mark_tokens, occluded } from "./RKR.js";
let length_of_tokens_tiled = 0;

function markarrays(s, doublyLinkedList, pattern_mark, text_mark) {
  //console.log(doublyLinkedList);
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
      //console.log("match " + match.p, match.t, match.s);
    }

    let occlusionResult = occluded(match, pattern_mark, text_mark);
    console.log(
      "Ocluded tokens " + occlusionResult.occludedTokens,
      "IsOcluded " + occlusionResult.isOccluded
    );

    //Check if match is occluded
    if (!occlusionResult.isOccluded) {
      console.log("Marking tokens: " + match.p, match.t, match.s);
      mark_tokens(match, pattern_mark, text_mark);

      length_of_tokens_tiled += match.s;
    } else if (match.s - occlusionResult.occludedTokens >= s) {
      let unmarkedPortion = {
        length: match.s - occlusionResult.occludedTokens,
        matches: [
          {
            p: match.p + occlusionResult.occludedTokens,
            t: match.t + occlusionResult.occludedTokens,
            s: match.s - occlusionResult.occludedTokens,
          },
        ],
      };
      doublyLinkedList.insert(
        unmarkedPortion.length,
        unmarkedPortion.matches[0]
      );
      console.log(
        `Unmarked portion: length: ${unmarkedPortion.length}, p: ${unmarkedPortion.matches[0].p}, t: ${unmarkedPortion.matches[0].t}, s: ${unmarkedPortion.matches[0].s}`
      );
    }

    // console.log("Size of match s: " + match.s);
    // console.log("Size of oclusion: " + occlusionResult.occludedTokens);
  }

  console.log(text_mark, pattern_mark);
  console.log("Length of tokens tiled:", length_of_tokens_tiled);
}
export default markarrays;
