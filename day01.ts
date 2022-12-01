import {readFileSync} from "fs";

const input = readFileSync('day01.input', 'utf-8')
    .split(/\r?\n\r?\n/)
    .map(x => x.split(/\r?\n/).map(Number).reduce((x, y) => x + y, 0))

// part 1
console.log(Math.max(...input));

// part 2
input.sort((a, b) => b - a)
console.log(input[0] + input[1] + input[2])
