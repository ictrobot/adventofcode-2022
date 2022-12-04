import {readFileSync} from "fs"

const input = readFileSync('day04.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(/[-,]/).map(Number))

// part 1
console.log(input.filter(([a1, a2, b1, b2]) => {
    return (a1 >= b1 && a2 <= b2) || (b1 >= a1 && b2 <= a2)
}).length)

// part 2
console.log(input.filter(([a1, a2, b1, b2]) => {
    return a1 <= b2 && b1 <= a2
}).length)
