
import {BinarySearchTree, minimum} from './binary_search_tree.mjs';
import {RedBlackTreeNode, Color, to_graphviz} from '../nodes/red_black_tree_node.mjs'

export default class RedBlackTree extends BinarySearchTree {

    /**
     * @param {RedBlackTreeNode} root
     */
    constructor(root = null) {
        const nil_node = new RedBlackTreeNode();

        super(root !== null ? root : nil_node);

        this._size = root === null ? 0 : 1;
        this._nil_node = nil_node;

        // Assure that the root is compliant with the properties.

        this._root.color = Color.BLACK;
        this._root.left = this._nil_node;
        this._root.right = this._nil_node;
        this._root.parent = this._nil_node;
        this._root._nil_value = this._nil_node;

        this.RedBlackTreeNode = RedBlackTreeNode.bind(null, this._nil_node);

        this.to_graphviz = (...args) => to_graphviz(this._root, ...args)
    }

    /**
     * Create a red-black tree from an array of values or key-value pairs.
     *
     * @param {Array} arr
     * @returns {RedBlackTree}
     */
    static from(arr) {
        if (!Array.isArray(arr))
            throw Error('Not an array.');

        const red_black_tree = new RedBlackTree();

        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];

            if (Array.isArray(item)) {
                if (item.length !== 2)
                    throw Error(`Array item is not a pair: ${item}`);
                red_black_tree.insert(item[0], item[1]);
            } else {
                red_black_tree.insert(item);
            }
        }

        return red_black_tree;
    }

    insert_node(new_node) {
        BinarySearchTree.prototype.insert_node.call(this, new_node);

        new_node.color = Color.RED;
        new_node.left = this._nil_node;
        new_node.right = this._nil_node;

        for (let node = new_node; node !== this._root && node.parent.color === Color.RED;) {

            // TODO: This could be slow.
            const [parent_direction, opposite_parent_direction] = node.parent === node.parent.parent.left
                ? ['left', 'right']
                : ['right', 'left']
            ;

            // TODO: It would be nice to have `uncle` not be in this scope. (Although, with an init statement would technically not make difference in this case. :))
            const uncle = node.parent.parent[opposite_parent_direction];

            if (uncle.color === Color.RED) {
                node.parent.color = Color.BLACK;
                uncle.color = Color.BLACK;
                node.parent.parent.color = Color.RED;

                node = node.parent.parent;
            } else {
                // If `node`, `node.parent`, and `node.parent.parent` make a zigzag, straighten them.
                if (node === node.parent[opposite_parent_direction]) {
                    // TODO: This assignment is a bit confusing.
                    node = node.parent;
                    this._rotate(node, parent_direction);
                }

                node.parent.color = Color.BLACK;
                node.parent.parent.color = Color.RED;
                this._rotate(node.parent.parent, opposite_parent_direction);
            }
        }

        this._root.color = Color.BLACK;

        return new_node;
    }

    insert(key, value = key) {
        return this.insert_node(new this.RedBlackTreeNode(key, value));
    }

    _delete_fix_violations(node) {
        while (node !== this._root && node.color === Color.BLACK) {
            const [direction, opposite_direction] = node === node.parent.left
                ? ['left', 'right']
                : ['right', 'left']
            ;

            let sibling = node.parent[opposite_direction];

            if (sibling.color === Color.RED) {
                sibling.color = Color.BLACK;
                node.parent.color = Color.RED;
                this._rotate(node, direction);
            }

            if (sibling.left.color === Color.BLACK && sibling.right.color === Color.BLACK) {
                sibling.color = Color.RED;
                node = node.parent;
            } else {

                if (sibling[opposite_direction].color === Color.BLACK) {
                    sibling[direction].color = Color.BLACK;
                    sibling.color = Color.RED;
                    this._rotate(sibling, opposite_direction);
                    sibling = node.parent[opposite_direction];
                }

                sibling.color = node.parent.color;
                node.parent.color = Color.BLACK;
                sibling.right.color = Color.BLACK;
                this._rotate(node.parent, direction);
                node = this._root;
            }
        }
        node.color = Color.BLACK;
    }

    delete_node(delete_node) {
        if (delete_node.is_empty())
            throw Error('Cannot delete the empty nil node.');

        let potential_violator_node;
        let potential_violation_color;

        // Case A: `delete_node` has only one child.
        // -------------------------------------------
        //
        // (Applies to the `if` and `else if` cases below)
        //
        // The single child takes `deletion_node`s position. If `deletion_node`s color
        // was black, that child node could be causing a violation.

        if (delete_node.left.is_empty()) {
            potential_violator_node = delete_node.right;
            this._transplant(delete_node.right, delete_node);
            potential_violation_color = delete_node.color;


        } else if (delete_node.right.is_empty()) {
            potential_violator_node = delete_node.left;
            this._transplant(delete_node.left, delete_node);
            potential_violation_color = delete_node.color;

        } else {

            // Case B: `delete_node` has two children.
            // ---------------------------------------
            //
            // A node in `delete_node`s right subtree takes `delete_node`s position. Its position is
            // in turn taken by another node. If `delete_node`s replacement's color was black, the node
            // taking its place could be causing a violation.

            const delete_node_replacement = minimum(delete_node.right);

            // `potential_violator_node` will be put in `delete_node_replacement`s position.
            // If `delete_node_replacement`s color is black, then there could be a violation.
            potential_violator_node = delete_node_replacement.right;
            potential_violation_color = delete_node_replacement.color;

            if (delete_node_replacement.parent === delete_node && !potential_violator_node.is_empty()) {
                potential_violator_node.parent = delete_node_replacement;
            } else {
                this._transplant(delete_node_replacement.right, delete_node_replacement);
                delete_node_replacement.right = delete_node.right;
                delete_node_replacement.right.parent = delete_node_replacement;
            }

            this._transplant(delete_node_replacement, delete_node);

            delete_node_replacement.left = delete_node.left;
            delete_node_replacement.left.parent = delete_node_replacement;
            delete_node_replacement.color = delete_node.color;
        }

        if (!potential_violator_node.is_empty() && potential_violation_color === Color.BLACK)
            this._delete_fix_violations(potential_violator_node);

        this._size--;

        return true;
    }
    
    delete(key) {
        const node = this.search(key);
        return node !== null ? this.delete_node(node) : false;
    }
}