class Node {
  constructor(length, match) {
    this.length = length;
    this.matches = [match];
    this.next = null;
    this.prev = null;
  }

  isEmpty() {
    return this.matches.length === 0;
  }

  dequeue() {
    return this.matches.shift();
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  find(length) {
    let current = this.head;
    while (current) {
      if (current.length === length) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  insert(length, match) {
    const newNode = new Node(length, match);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      let current = this.tail;
      while (current && current.length < length) {
        current = current.prev;
      }
      if (current === this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      } else if (!current) {
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
      } else {
        newNode.next = current.next;
        newNode.prev = current;
        current.next.prev = newNode;
        current.next = newNode;
      }
    }
    this.length++;
  }

  isEmpty() {
    return this.head === null;
  }

  shift() {
    if (this.isEmpty()) {
      return null;
    }

    const nodeToReturn = this.head;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.length--;
    return nodeToReturn;
  }

  printList() {
    let current = this.head;
    while (current) {
      console.log(
        `Length: ${current.length}, Matches: ${JSON.stringify(current.matches)}`
      );
      current = current.next;
    }
  }
  getSize() {
    return this.length;
  }
}
export { Node, DoublyLinkedList };
