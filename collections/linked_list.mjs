import {NIL_NODE, LinkedListNode} from '../nodes/linked_list_node.mjs';

export default class LinkedList {
    constructor() {
        this._head = NIL_NODE;
    }

    static from(arr) {
        const list = new LinkedList();
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (Array.isArray(item) && item.length === 2) {
                list.insert(item[0], item[1]);
            } else {
                list.insert(item);
            }
        }
        return list;
    }

    search(key) {
        let node = this._head.next;
        while (node !== NIL_NODE && node.key !== key)
            node = node.next;

        return node === NIL_NODE
            ? null
            : node
        ;
    }

    /**
     * @param {LinkedListNode} node
     */
    insert_node(node) {
        node.next = this._head.next;
        this._head.next.prev = node;
        this._head.next = node;
        node.prev = this._head;
    }

    /**
     * @param key
     * @param value
     */
    insert(key, value = key) {
        return this.insert_node(new LinkedListNode(key, null, null, value));
    }

    static delete_node(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    delete(key) {
        const node = this.search(key);
        return node !== null
            ? LinkedList.delete_node(node)
            : null
        ;
    }

    *[Symbol.iterator]() {
        for (let node = this._head.next; node !== NIL_NODE; node = node.next) {
            yield node.value;
        }
    }
}