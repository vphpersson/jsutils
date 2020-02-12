import {counting_sort} from './counting_sort.mjs';

export default function radix_sort(grid, universe_length) {
    if (grid.length === 0)
        return grid;

    for (let width_pos = grid[0].length - 1; width_pos >= 0; width_pos--)
        grid = counting_sort(grid, universe_length, (item, i) => grid[i][width_pos]);

    return grid;
}
