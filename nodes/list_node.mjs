import Node from './node.mjs';

export default class ListNode extends Node {
    constructor(key, value = key) {
        super(value);
        this.key = key;
    }
}