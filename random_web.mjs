import {buffer_to_hex} from './conversion.mjs';

/**
 * Return a random 32-bit unsigned integer.
 *
 * @returns {number} - A random 32-bit unsigned integer.
 */
export function random_int() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
}

/**
 * Return a random 32-bit unsigned integer as a hex string.
 *
 * @returns {string} - A random 32-bit unsigned integer as a hex string.
 */
export function random_int_hex() {
    return buffer_to_hex(window.crypto.getRandomValues(new Uint32Array(1)).buffer)
}