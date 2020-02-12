export default class Stack {
    constructor(arr = null) {
        this._arr = arr !== null ? arr : [];
    }

    push(...items) {
        return this._arr.push(...items);
    }

    pop() {
        return this._arr.pop();
    }

    peek() {
        return this._arr[this._arr.length - 1];
    }
}