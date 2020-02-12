/**
 * Produce a hex string representation of a buffer's contents.
 *
 * @param {ArrayBuffer|SharedArrayBuffer} buffer - The buffer whose contents is converted to a hex string.
 * @return {string} - A hex string of buffer's contents.
 */
export function buffer_to_hex(buffer) {
    const hex_codes = [];
    const data_view = new DataView(buffer);

    for (let i = 0; i < data_view.byteLength; i += 4)
        hex_codes.push(data_view.getUint32(i).toString(16).padStart(8, '0'));

    return hex_codes.join('');
}

