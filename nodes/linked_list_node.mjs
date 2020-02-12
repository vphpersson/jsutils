import ListNode from './list_node.mjs';

export let NIL_NODE;

export class LinkedListNode extends ListNode {
    constructor(key = null, prev = null, next = null, value = key) {
        super(key, value);
        this.prev = prev;
        this.next = next;
    }
}

NIL_NODE = new LinkedListNode();
NIL_NODE.prev = NIL_NODE;
NIL_NODE.next = NIL_NODE;
