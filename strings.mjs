export function to_alphabet(text) {
    const characters = new Set(text);
    characters.add('');
    return Array.from(characters);
}

export function symbol_to_lex(alphabet) {
    const map = new Map();
    alphabet.forEach((symbol, i) => map.set(symbol, i));
    return map;
}

export function title(str) {
    if (typeof str !== 'string')
        throw Error('Not a string.');

    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

/**
 * Transform a text into a sluggified version.
 *
 * @param {string} text - The text to be sluggified.
 * @returns {string} - The sluggified version of `text`.
 */
export function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '')             // Trim - from end of text
    ;
}

/**
 * Strip a specified character from the left-hand side of a string.
 *
 * @param {string} str - The string to be stripped of `chr` on its left-hand side.
 * @param {string} chr - The character to strip from the left-hand side of `str`.
 * @returns {string} - The stripped string.
 */
export function strip_left(str, chr) {
    if (typeof(chr) !== 'string')
        throw Error('Character is not a string.');

    if (chr.length !== 1)
        throw Error('Character is not of length 1.');

    let i;
    for (i = 0; i < str.length; i++)
        if (str[i] !== chr)
            break;

    return str.slice(i);
}

/**
 * Strip a specified character from the right-hand side of a string.
 *
 * @param {string} str - The string to be stripped of `chr` on its right-hand side.
 * @param {string} chr - The character to strip from the right-hand side of `str`.
 * @returns {string} - The stripped string.
 */
export function strip_right(str, chr) {
    if (typeof(chr) !== 'string')
        throw Error('Character is not a string.');

    if (chr.length !== 1)
        throw Error('Character is not of length 1.');

    let i = str.length;
    while (i--)
        if (str[i] !== chr)
            break;

    return str.slice(0, i+1);
}

/**
 * Produce a snake cased version of a camel cased string.
 *
 * @param {string} camel_case_string - The camel cased string whose value to transform.
 * @returns {string} - The camel cased string as a snake cased string.
 */
function camel_case_to_snake_case(camel_case_string) {
    return camel_case_string.replace(
        /(?<=.)((?<=[a-z])[A-Z]|[A-Z](?=[a-z]))/g, match => `_${match.toLowerCase()}`
    ).toLowerCase();
}