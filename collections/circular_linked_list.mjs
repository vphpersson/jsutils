import LinkedList from './linked_list.mjs';
import {NIL_NODE} from '../nodes/linked_list_node.mjs';

export default class CircularLinkedList extends LinkedList {
    constructor() {
        super();
    }

    *[Symbol.iterator]() {
        let node = this._head.next;

        if (node === NIL_NODE)
            return null;

        while (true) {
            yield node.value;
            node = node.next;
            if (node === NIL_NODE) {
                node = node.next;
            }
        }
    }
}