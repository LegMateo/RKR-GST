import { DoublyLinkedList } from "./dataStructures.js";
import { Node } from "./dataStructures.js";
import { mark_tokens, occluded } from "./RKR.js";

function markarrays(s, doublyLinkedList, pattern_mark, text_mark) {
  let match = null;

  while (!doublyLinkedList.isEmpty()) {
    let currentQueue = doublyLinkedList.head;

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
    } else if (match.s - occlusionResult.occludedTokens >= s / 2) {
      let unmarkedPortion = {
        length: match.s - occlusionResult.occludedTokens,
        matches: [
          {
            p: match.p,
            t: match.t,
            s: match.s - occlusionResult.occludedTokens,
          },
        ],
      };
      doublyLinkedList.insert(
        unmarkedPortion.length,
        unmarkedPortion.matches[0]
      );
      console.log(
        `Reinserting unmarked portion: length = ${unmarkedPortion.length}, p = ${unmarkedPortion.matches[0].p},  t = ${unmarkedPortion.matches[0].t}, s = ${unmarkedPortion.matches[0].s}`
      );
    }
  }

  console.log(`Final Text Mark: ${text_mark}`);
  console.log(`Final Pattern Mark: ${pattern_mark}`);
}
export default markarrays;
