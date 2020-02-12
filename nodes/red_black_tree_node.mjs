import BinarySearchTreeNode from "./binary_search_tree_node.mjs";

export const Color = {
    BLACK: 0,
    RED: 1
};

export class RedBlackTreeNode extends BinarySearchTreeNode {

    /**
     * @param nil_value - A value corresponding to a nil node.
     * @param key - A key for finding a node in the tree.
     * @param value - A value of an arbitrary type. Defaults to the value of `key`.
     * @param color - A color; either _red_ or _black_.
     * @param {RedBlackTreeNode} left
     * @param {RedBlackTreeNode} right
     * @param {RedBlackTreeNode} parent
     */
    constructor(nil_value, key, value = key, color = Color.BLACK, left = nil_value, right = nil_value, parent = nil_value) {
        super(nil_value, key, value, left, right, parent);
        this.color = color;
    }
}

export function to_graphviz(tree_root, value = node => node.value, graph_type = 'digraph', name = '', with_nil_nodes = false) {
    let str_buf = '';

    str_buf += `${graph_type} ${name} {\n`;

    for (const node of tree_root.depth_first.in_order()) {
        str_buf += `${node._id}[xlabel="${node.key}", label="${value(node)}", color="${node.color === Color.BLACK ? 'black' : 'red'}"];\n`;

        // TODO: Have empty nodes represented by a hidden node with a dot arrow head.

        if (with_nil_nodes || !node.left.is_empty())
            str_buf +=`${node._id} -> ${node.left._id};\n`;
        if (with_nil_nodes || !node.right.is_empty()) {
            str_buf += `${node._id} -> ${node.right._id};\n`;
        }
    }

    str_buf += '}\n';

    return str_buf;
}