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

/**
 * Flatten an object.
 *
 * @param base_object - The object to flatten.
 * @return {object} - A flattened version of the input object.
 */
export function flatten_object(base_object) {
    if (!base_object)
        return {};

    const flattened_object = {};

    function traverse(object, path) {
        for (const [key, value] of Object.entries(object)) {
            if (typeof(object[key]) === 'object') {
                traverse(object[key], `${path}${key}.`);
            } else {
                flattened_object[`${path}${key}`] = value
            }
        }
    }

    traverse(base_object, '');
    return flattened_object;
}
