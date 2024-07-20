import markarrays from "./markarrays.js";
import { DoublyLinkedList } from "./dataStructures.js";

let doublyLinkedList = new DoublyLinkedList();
let s = 2;

doublyLinkedList.insert(2, { p: 0, t: 0, s: 2 });
doublyLinkedList.insert(2, { p: 1, t: 1, s: 5 });

doublyLinkedList.printList();
let pattern_mark = new Array(5).fill(false);
let text_mark = new Array(5).fill(false);

markarrays(s, doublyLinkedList, pattern_mark, text_mark);
