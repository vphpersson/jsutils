export default class Lcp_array extends Array {

    constructor(...args) {
        super(...args);
    }

    static from(text, suffix_array) {
        const suffix_array_inv = suffix_array.inverse();

        let lcp_array = new Array(text.length - 1);

        let l = 0;

        for (let i = 0; i < text.length; i++) {
            const k = suffix_array_inv[i];
            const j = suffix_array[k - 1];
            while (text[i + l] === text[j + l])
                l++;
            lcp_array[k - 1] = l;
            if (l > 0) {
                l--;
            }
        }

        lcp_array = new Lcp_array(...lcp_array);
        Object.freeze(this);

        return lcp_array;
    }
}