export const SortOrder = {
    ORDERED: 0,
    REVERSE: 1,
    REVERSE_GROUP: 2
};


export function counting_sort(collection, universe_length, key = (item, i) => item, sort_order = SortOrder.ORDERED) {
    const count = new Array(universe_length);
    collection.forEach((item, i) => {
        // NOTE: The `||` here is to account for `undefined` keys, although it may not be very smart.
        const item_key = key(item, i) || 0;
        count[item_key] = (count[item_key] || 0) + 1;
    });

    let total = 0;
    let increment_value;

    switch (sort_order) {
        case SortOrder.ORDERED:
            for (let i = 0; i < universe_length; i++) {
                const old_count = count[i] || 0;
                count[i] = total;
                total += old_count;
            }
            increment_value = 1;
            break;
        case SortOrder.REVERSE:
            for (let i = universe_length - 1; i >= 0; i--) {
                total += count[i] || 0;
                count[i] = total - 1;
            }
            increment_value = -1;
            break;
        case SortOrder.REVERSE_GROUP:
            for (let i = universe_length - 1; i >= 0; i--) {
                const old_count = count[i] || 0;
                count[i] = total;
                total += old_count;
            }
            increment_value = 1;
            break;
    }

    const output = new Array(total);
    collection.forEach((item, i) => {
        const item_key = key(item, i) || 0;
        output[count[item_key]] = item;
        count[item_key] += increment_value;
    });
    
    return output;
}
