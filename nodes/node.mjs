export default class Node {

    static id_counter = 0;

    constructor(value = null) {
        this.value = value;
        this._id = Node.id_counter++;
    }

    is_empty() {
        return this.value === null;
    }
}
