export default class Default_map extends Map {

    constructor(default_initializer) {
        super();
        this.default_initializer = default_initializer;
    }

    set (key, value = undefined) {
        return Map.prototype.set.call(this, key, value !== undefined ? value : this.default_initializer());
    }

    get(key) {
        if (Map.prototype.has.call(this, key))
            return Map.prototype.get.call(this, key);

        const value = this.default_initializer();
        Map.prototype.set.call(this, key, value);
        return value;
    }
}