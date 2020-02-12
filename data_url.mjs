export default class DataURL {

    /**
     * @param {string} data_url - A base64 data URL.
     */
    constructor(data_url = '') {
        const match = /^data:(?<media_type>[^,;]+)(;charset=(?<char_set>[^,;]+))?(;base64)?,(?<data>.*)$/.exec(data_url);
        if (!match)
            throw Error('Invalid data URL');
        Object.assign(this, match.groups);
    }

    /**
     * @param {string} media_type - The media type.
     * @param {string} data - The base64 data.
     * @param {string} char_set - The character set.
     */
    static from(media_type, data, char_set = '') {
        return new DataURL(DataURL._to_string(media_type, data, char_set));
    }

    static _to_string(media_type, data, char_set) {
        return `data:${media_type}${char_set ? ';charset=' + char_set : ''};base64,${data}`;
    }

    toString() {
        return DataURL._to_string(this.media_type, this.data, this.char_set);
    }
}