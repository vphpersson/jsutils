/**
 * Make a yyyy-mm-dd representation of a date.
 *
 * @param date_representation
 * @returns {string} - The yyyy-mm-dd representation of `date`.
 */
export function to_yyyy_mm_dd(date_representation) {
    const date = date_representation instanceof Date
        ? date_representation
        : new Date(date_representation)
    ;

    if (isNaN(date))
        throw Error('Invalid date.');

    const year_str = String(date.getFullYear());
    const month_str = String(date.getMonth() + 1);
    const day_str = String(date.getDate());

    return `${year_str}-${month_str.padStart(2, '0')}-${day_str.padStart(2, '0')}`;
}