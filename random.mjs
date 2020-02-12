export function get_random_positive_integer(max, min = 0) {
    return Math.floor(Math.random() * (max - min)) + min;
}