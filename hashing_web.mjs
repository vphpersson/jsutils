import {buffer_to_hex} from './conversion.mjs';

/**
 * Hash a buffer using a specified hashing algorithm.
 *
 * See `https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest`.
 *
 * @param {ArrayBuffer|ArrayBufferView} buffer - A buffer whose contents is to be hashed.
 * @param {boolean} as_hex - Whether to return the hash as
 * @param {AlgorithmIdentifier} algorithm_str - The name of the hashing algorithm to use.
 * @returns {PromiseLike<ArrayBuffer>|Promise<string>} - The resulting hash.
 */
export async function hash(buffer, as_hex = true, algorithm_str = 'SHA-256') {
    return as_hex
        ? buffer_to_hex(await window.crypto.subtle.digest(algorithm_str, buffer))
        : window.crypto.subtle.digest(algorithm_str, buffer)
    ;
}

/**
 * Hash a string using a specified hashing algorithm.
 *
 * See `https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest`.
 *
 * @param {string} data_str - A string to be hashed.
 * @param {boolean} as_hex - Whether to return the hash as
 * @param {AlgorithmIdentifier} algorithm_str - The name of a hashing algorithm to use.
 * @returns {PromiseLike<ArrayBuffer>|Promise<string>} - The resulting hash.
 */
export function hash_str(data_str, as_hex = true, algorithm_str = 'SHA-256') {
    return hash(new TextEncoder('utf-8').encode(data_str), as_hex, algorithm_str);
}

