import Node from './node.mjs';

export default class KaryNode extends Node {
    constructor(value, children) {
        super(value);
        this.children = children || [];
    }

    *[Symbol.iterator]() {
        yield* this.children;
    }

    get last_child() {
        return this.children[this.children.length-1];
    }

    set last_child(value) {
        this.children[this.children.length-1] = value;
    }

    get first_child() {
        return this.children[0];
    }

    set first_child(value) {
        this.children[0] = value;
    }
}