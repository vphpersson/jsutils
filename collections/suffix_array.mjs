import {to_alphabet, symbol_to_lex as s_to_l} from '../strings.mjs';
import {arrays_equal} from '../collections.mjs'
import radix_sort from '../algorithms/sorting/radix_sort.mjs';

export default class SuffixArray extends Array {

    constructor(...args) {
        super(...args);
    }

    static from_text(text, alphabet = null, symbol_to_lex = null) {
        if (alphabet === null)
            alphabet = to_alphabet(text);

        if (symbol_to_lex === null)
            symbol_to_lex = s_to_l(alphabet);

        return SuffixArray.from_text_lex(
            [...Array.from(text).map(symbol => symbol_to_lex.get(symbol)), 0],
            alphabet.length
        );
    }

    static from_text_lex(text_lex, alphabet_length = null) {
        if (alphabet_length === null)
            alphabet_length = new Set(text_lex).size;

        let suffix_array = new Array(text_lex.length );
        suffix_array[0] = text_lex.length;

        // Step 0

        const C = (() => {
            const C = [[], [], []];

            for (let k = 0; k < 3; k++) {
                for (let i = 0; i < text_lex.length - 1; i++) {
                    const offset = 3 * i + k;
                    if (offset < text_lex.length - 1) {
                        C[k].push(offset)
                    }
                }
            }

            return C;
        })();

        const A = [...C[1], ...C[2]];

        // Step 1

        function get_sorted_T_A(C, R_symbol_len = 3) {
            const R = (() => {
                const R = new Array(3);

                for (let k = 1; k < 3; k++)
                    R[k] = C[k].map(offset => {
                        const lex_tuple = new Array(R_symbol_len);
                        for (let i = offset; i < offset + R_symbol_len; i++)
                            lex_tuple[i - offset] = text_lex[i] || 0
                        return lex_tuple;
                    });

                return R;
            })();

            const [R_inv, all_unique] = (() => {
                const str_lexes = [...R[1], ...R[2]];
                const str_lex_to_str_lex_index = new Map(); {
                    str_lexes.forEach((str_lex, i) => str_lex_to_str_lex_index.set(str_lex, i));
                }

                const sorted_str_lexes = radix_sort(str_lexes, alphabet_length);
                const R_inv = new Array(str_lexes.length + 1);
                let all_unique = true;
                let k = 0;

                sorted_str_lexes.forEach((sorted_str_lex, i) => {
                    const prev_sorted_str_lex = sorted_str_lexes[i-1] || [];

                    let rank;
                    if (!arrays_equal(sorted_str_lex, prev_sorted_str_lex)) {
                        k++;
                        rank = i + 1;
                    } else {
                        all_unique = false;
                        rank = k;
                    }

                    R_inv[str_lex_to_str_lex_index.get(sorted_str_lex)] = rank;
                });

                R_inv[R_inv.length-1] = 0;

                return [R_inv, all_unique];
            })();

            if (all_unique) {
                const T_A = new Array(A.length); {
                    A.forEach((t_offset, i) => T_A[R_inv[i] - 1] = t_offset);
                }
                return [T_A, R_inv];
            } else {
                // NOTE: I'm not sure this is ok concerning the theoretical order of the algorithm.
                return get_sorted_T_A(C, R_symbol_len * 2);
            }
        }

        const [T_A, sa_R_inv_inv] = get_sorted_T_A(C);

        const N = new Array(text_lex.length + 2); {
            A.forEach((R_offset, i) => N[R_offset] = sa_R_inv_inv[i]);
            C[0].forEach(idx => N[idx] = null);
            N[N.length-3] = null;
            N[N.length-2] = 0;
            N[N.length-1] = 0;
        }

        // Step 2

        const T_A_other = (() => {
            const pairs = C[0].map(idx => [text_lex[idx], N[idx + 1]]);
            const pair_to_text_offset = new Map(); {
                pairs.forEach((pair, i) => pair_to_text_offset.set(pair, C[0][i]));
            }

            // NOTE: The value in index 1 is a position in A.
            // Since the indices of A can only occur once, there can be
            // no duplicate pairs (right?), and thus no possibility of ambiguous order.
            const sorted_pairs = radix_sort(pairs, sa_R_inv_inv.length);

            const T_A_other = new Array(C[0].length); {
                sorted_pairs.forEach((sorted_pair, i) => {
                    T_A_other[i] = pair_to_text_offset.get(sorted_pair);
                });
            }
            return T_A_other;
        })();

        // Step 3

        let i = 0;
        let j = 0;

        while (i < T_A.length && j < T_A_other.length) {
            const T_A_elem = T_A[i];
            const T_A_other_elem = T_A_other[j];

            const C_group = T_A_elem % 3;

            if (text_lex[T_A_elem] === text_lex[T_A_other_elem]) {
                switch (C_group) {
                    case 1:
                        if (N[T_A_elem + 1] <= N[T_A_other_elem + 1]) {
                            suffix_array[i+j+1] = T_A_elem;
                            i++;
                        } else {
                            suffix_array[i+j+1] = T_A_other_elem;
                            j++;
                        }
                        break;
                    case 2:
                        if (text_lex[T_A_elem+1] === text_lex[T_A_other_elem+1]) {
                            if (N[T_A_elem+2] <= N[T_A_other_elem+2]) {
                                suffix_array[i+j+1] = T_A_elem;
                                i++;
                            } else {
                                suffix_array[i+j+1] = T_A_other_elem;
                                j++;
                            }
                        } else if (text_lex[T_A_elem+1] <= text_lex[T_A_other_elem+1]) {
                            suffix_array[i+j+1] = T_A_elem;
                            i++;
                        } else {
                            suffix_array[i+j+1] = T_A_other_elem;
                            j++;
                        }
                        break
                }
            } else if (text_lex[T_A_elem] <= text_lex[T_A_other_elem]) {
                suffix_array[i+j+1] = T_A_elem;
                i++;
            } else {
                suffix_array[i+j+1] = T_A_other_elem;
                j++;
            }
        }

        while (i < T_A.length)
            suffix_array[i+j+1] = T_A[i++];

        while (j < T_A_other.length)
            suffix_array[i + j + 1] = T_A_other[j++];

        suffix_array = new SuffixArray(...suffix_array);
        // suffix_array.textual = () => suffix_array.map(idx => text.slice(idx));

        Object.freeze(suffix_array);

        return suffix_array;
    }

    inverse() {
        const suffix_array_inv = new Array(this.length);
        this.forEach((text_offset, i) => suffix_array_inv[text_offset] = i);
        return suffix_array_inv;
    }
}
