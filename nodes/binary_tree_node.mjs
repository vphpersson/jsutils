import Binary_node from "./binary_node.mjs";
import Node from "./node.mjs";

// TODO: It would be nice to have a `TreeNode` that adds a `parent` property be a mix-in.
export class BinaryTreeNode extends Binary_node {
    constructor(value, left = null, right = null, parent = null) {

        if (left !== null && !(left instanceof Node))
            left = new BinaryTreeNode(left);
        if (right !== null && !(right  instanceof Node))
            right = new BinaryTreeNode(right);

        super(value, left, right);

        // if (left && !this.left.is_empty())
        //     this.left.parent = this;
        //
        // if (right && !this.right.is_empty())
        //     this.right.parent = this;

        this.parent = parent;
    }

    set left(left_value) {
        this.children[0] = left_value instanceof Node ? left_value : new BinaryTreeNode(left_value);
        // this.children[0].parent = this;
    }

    set right(right_value) {
        this.children[1] = right_value instanceof Node ? right_value : new BinaryTreeNode(right_value);
        // this.children[1].parent = this;
    }

    get left() {
        return this.children[0];
    }

    get right() {
        return this.children[1];
    }

    get depth_first() {
        return {
            pre_order: pre_order.bind(null, this),
            in_order: in_order.bind(null, this),
            reverse_in_order: reverse_in_order.bind(null, this),
            post_order: post_order.bind(null, this)
        };
    }

    // *breadth_first(yield_property = 'value') {
    //     yield this[yield_property];
    //
    //     for (const child of this.children)
    //         yield child[yield_property];
    // }
}

function* pre_order(node) {
    if (node.is_empty())
        return;

    yield node;

    if (!node.left.is_empty())
        yield* node.left.depth_first.pre_order();

    if (!node.right.is_empty()) {
        yield* node.right.depth_first.pre_order();
    }
}

function* in_order(node) {
    if (node.is_empty())
        return;

    if (!node.left.is_empty())
        yield* node.left.depth_first.in_order();

    yield node;

    if (!node.right.is_empty()) {
        yield* node.right.depth_first.in_order();
    }
}

function* reverse_in_order(node) {
    if (node.is_empty())
        return;

    if (!node.right.is_empty())
        yield* node.right.depth_first.reverse_in_order();

    yield node;

    if (!node.left.is_empty()) {
        yield* node.left.depth_first.reverse_in_order();
    }
}

function* post_order(node) {
    if (node.is_empty())
        return;

    if (!node.left.is_empty())
        yield* node.left.depth_first.post_order();

    if (!node.right.is_empty())
        yield* node.right.depth_first.post_order();

    yield node;
}


export function to_graphviz(tree_root, graph_type = 'digraph', name = '', with_nil_nodes = false, value = node => node.value) {
    let str_buf = '';

    str_buf += `${graph_type} ${name} {\n`;

    for (const node of tree_root._nodes()) {
        str_buf += `${node._id}[xlabel="${node.key}", label="${value(node)}"];\n`;

        if (!node.left.is_empty()) {
            str_buf += `${node._id} -> ${node.left._id};\n`;
        } else if (with_nil_nodes) {
            const nil_node_name = `left${node._id}`;
            str_buf += `${nil_node_name}[style=invis];\n`;
            str_buf += `${node._id} -> ${nil_node_name}[arrowhead=dot];\n`;
        }

        if (!node.right.is_empty()) {
            str_buf += `${node._id} -> ${node.right._id};\n`;
        } else if (with_nil_nodes) {
            const nil_node_name = `right${node._id}`;
            str_buf += `${nil_node_name}[style=invis];\n`;
            str_buf += `${node._id} -> ${nil_node_name}[arrowhead=dot];\n`;
        }
    }

    str_buf += '}\n';

    return str_buf;
}