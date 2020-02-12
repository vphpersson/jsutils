
import {to_graphviz} from "../nodes/binary_tree_node.mjs";
import BinarySearchTreeNode from '../nodes/binary_search_tree_node.mjs';

export class BinarySearchTree {
    /**
     * @param {BinarySearchTreeNode} root - The root of the binary search tree.
     */
    constructor(root = null) {
        const nil_node = new BinarySearchTreeNode();

        this._root = root !== null ? root : nil_node;

        this._size = root === null ? 0 : 1;
        this._nil_node = nil_node;

        this._root.left = this._nil_node;
        this._root.right = this._nil_node;
        this._root.parent = this._nil_node;
        this._root._nil_value = this._nil_node;

        this.BinarySearchTreeNode = BinarySearchTreeNode.bind(null, this._nil_node);

        this.minimum = () => minimum(this._root);
        this.maximum = () => maximum(this._root);
        this.search = key => search(this._root, key);
        this.to_graphviz = (...args) => to_graphviz(this._root, ...args)
    }

    /**
     * Create a binary search tree from an array of values or key-value pairs.
     *
     * @param {Array} arr
     * @returns {BinarySearchTree}
     */
    static from(arr) {
        if (!Array.isArray(arr))
            throw Error('Not an array.');

        const binary_search_tree = new BinarySearchTree();

        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];

            if (Array.isArray(item)) {
                if (item.length !== 2)
                    throw Error(`Array item is not a pair: ${item}`);
                binary_search_tree.insert(item[0], item[1]);
            } else {
                binary_search_tree.insert(item);
            }
        }

        return binary_search_tree;
    }

    get size() {
        return this._size;
    }

    insert_node(new_node) {
        if (this.size === 0) {
            this._root = new_node;
            this._root.left = this._nil_node;
            this._root.right = this._nil_node;
            this._root.parent = this._nil_node;
            this._size++;
            return;
        }

        let node = this._root;
        let parent_node = node.parent;
        while (!node.is_empty()) {
            parent_node = node;
            node = new_node.key <= node.key
                ? node.left
                : node.right
            ;
        }

        new_node.parent = parent_node;

        if (parent_node.is_empty())
            this._root = new_node;
        else if (new_node.key < parent_node.key)
            parent_node.left = new_node;
        else
            parent_node.right = new_node;

        this._size++;
    }

    insert(key, value = key) {
        this.insert_node(new this.BinarySearchTreeNode(key, value));
    }

    delete_node(delete_node) {
        if (delete_node.is_empty())
            throw Error('Cannot delete nil node.');

        if (delete_node.left.is_empty()) {
            this._transplant(delete_node.right, delete_node);
        } else if (delete_node.right.is_empty()) {
            this._transplant(delete_node.left, delete_node);
        }
    }

    clear() {
        this._root = this._nil_node;
        this._size = 0;
    }

    /**
     * Have `new_subtree_node` take `current_subtree_node`s position in the tree.
     *
     * @param {RedBlackTreeNode} new_subtree_node
     * @param {RedBlackTreeNode} current_subtree_node
     * @private
     */
    _transplant(new_subtree_node, current_subtree_node) {
        if (current_subtree_node.parent.is_empty())
            this._root = new_subtree_node;
        else if (current_subtree_node === current_subtree_node.parent.left)
            current_subtree_node.parent.left = new_subtree_node;
        else
            current_subtree_node.parent.right = new_subtree_node;

        new_subtree_node.parent = current_subtree_node.parent;
    }

    _rotate(node, direction) {
        const opposite_direction = direction === 'left' ? 'right' : 'left';
        const opposite_node = node[opposite_direction];

        if (opposite_node.is_empty())
            return;

        node[opposite_direction] = opposite_node[direction];

        if (!opposite_node[direction].is_empty())
            opposite_node[direction].parent = node;

        this._transplant(opposite_node, node);

        opposite_node[direction] = node;
        node.parent = opposite_node;
    }

    *[Symbol.iterator]() {
        for (const node of this._root) {
            yield [node.key, node.value];
        }
    }

    *reverse() {
        for (const node of this._root.reverse()) {
            yield [node.key, node.value];
        }
    }

    *keys() {
        for (const node of this._root) {
            yield node.key;
        }
    }

    *reverse_keys() {
        for (const node of this._root.reverse()) {
            yield node.key;
        }
    }

    *values() {
        for (const node of this._root) {
            yield node.value;
        }
    }

    *reverse_values() {
        for (const node of this._root.reverse()) {
            yield node.value;
        }
    }

    *_nodes() {
        yield* this._root;
    }

    * _all_nodes() {
        yield* this._root._all();
    }
}

export function minimum(tree_root) {
    let min = tree_root;
    while (!min.left.is_empty())
        min = min.left;
    return min;
}

export function maximum(tree_root) {
    let max = tree_root;
    while (!max.right.is_empty())
        max = max.right;
    return max;
}

export function search(tree_root, key) {
    let node = tree_root;
    while (!node.is_empty()) {
        if (node.key === key) {
            return node;
        } else {
            node = key <= node.key
                ? node.left
                : node.right
            ;
        }
    }
    return null;
}
