import KaryNode from "./kary_node.mjs";

export default class BinaryNode extends KaryNode {
    constructor(value, left, right) {
        super(value, [left, right]);
        Object.seal(this.children);
    }

    set left(left_value) {
        this.children[0] = left_value;
    }

    set right(right_value) {
        this.children[1] = right_value;
    }

    get left() {
        return this.children[0];
    }

    get right() {
        return this.children[1];
    }
}