import {BinaryTreeNode} from "./binary_tree_node.mjs";

/**
 * @param nil_value - A value corresponding to a nil node.
 * @param key - A key for finding a node in the tree.
 * @param value - A value of an arbitrary type. Defaults to the value of `key`.
 * @param {BinarySearchTreeNode} left
 * @param {BinarySearchTreeNode} right
 * @param {BinarySearchTreeNode} parent
 */
export default class BinarySearchTreeNode extends BinaryTreeNode {
    constructor(nil_value, key, value = key, left = nil_value, right = nil_value, parent = nil_value) {
        super(value, left, right, parent);
        this.key = key;
        this._nil_value = nil_value;
    }

    *[Symbol.iterator]() {
        yield *this.depth_first.in_order()
    }

    *_all() {
        for (const node of this.depth_first.in_order()) {
            if (node.left.is_empty())
                yield node.left;

            yield node;

            if (node.right.is_empty()) {
                yield node.right;
            }
        }
    }

    *reverse() {
        yield* this.depth_first.reverse_in_order();
    }

    is_empty() {
        return this === this._nil_value;
    }
}