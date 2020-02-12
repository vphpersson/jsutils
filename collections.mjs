import {get_random_positive_integer} from './random.mjs';

export function next(arr, predicate = element => element) {
    for (const element of arr)
        if (predicate(element))
            return element;
    return null;
}

export function last(arr, predicate = element => element) {
    for (let i = arr.length - 1; i >= 0; i--) {
        const element = arr[i];
        if (predicate(element)) {
            return element;
        }
    }
    return null;
}

export function arrays_equal(arr_1, arr_2) {
    if (arr_1.length !== arr_2.length)
        return false;

    for (let i = 0; i < arr_1.length; i++)
        if (arr_1[i] !== arr_2[i])
            return false;

    return true;
}

export function is_iterable(object) {
    return object
        ? object[Symbol.iterator] === 'function'
        : false
    ;
}

export function shuffle(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        const random_idx = get_random_positive_integer(arr.length, i);
        // NOTE: According to StackOverflow, the use of destructing causes a significant slowdown. (I should verify this on my own.)
        const temp = arr[i];
        arr[i] = arr[random_idx];
        arr[random_idx] = temp;
    }

    return arr;
}