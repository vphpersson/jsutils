/**
 * Conversion type for the `convert_blob` function.
 *
 * @type {Readonly<{ArrayBuffer: string, BinaryString: string, DataURL: string, Text: string}>}
 */
export const BlobConversionType = Object.freeze({
    ArrayBuffer: 'readAsArrayBuffer',
    BinaryString: 'readAsBinaryString',
    DataURL: 'readAsDataURL',
    Text: 'readAsText'
});


// TODO: Fill in the different return types?
/**
 * Convert a blob or file.
 *
 * @param {Blob|File} blob - The blob or file to be converted.
 * @param {BlobConversionType} conversion_type - The type to which to convert the blob.
 * @returns {Promise<*>} - The type corresponding to the `conversion_type` value.
 */
export function convert_blob(blob, conversion_type) {
    return new Promise((resolve, reject) => {
        const file_reader = new FileReader();

        file_reader.onloadend = () => resolve(file_reader.result);
        file_reader.onerror = reject;
        file_reader.onabort = reject;

        file_reader[conversion_type](blob);
    });
}

/**
 * Convert a DOM image to a DOM canvas.
 *
 * @param {HTMLElement|string} img_reference - An image reference in the form of an Element or a selector.
 * @returns {Promise<HTMLCanvasElement>} - A canvas corresponding to the provided image.
 */
export async function img_to_canvas(img_reference) {

    const img = await (async () => {
        if (typeof(img_reference) === 'string') {
            // NOTE: Can throw due to invalid selector.
            img_reference = document.querySelector(img_reference);
        }

        if (!img_reference)
            throw Error('The image reference resolves to nothing.');

        if (!(img_reference instanceof HTMLElement))
            throw Error('Not an HTMLElement');

        if (img_reference.tagName !== 'IMG')
            throw Error('Not an img element');

        // If the image has not yet loaded, wait for it to load.

        if (!img_reference.complete) {
            await new Promise((resolve, reject) => {
                img_reference.addEventListener('load', resolve, {once: true});
                img_reference.addEventListener('error', reject, {once: true});
            });
        }

        return img_reference;
    })();

    const canvas = document.createElement('canvas'); {
        canvas.height = img.height;
        canvas.width = img.width;
    }

    canvas.getContext('2d').drawImage(img, 0, 0);

    return canvas;
}