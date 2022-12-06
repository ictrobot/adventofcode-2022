import {readFileSync} from "fs"

const [input] = readFileSync('day06.input', 'utf-8').split(/\r?\n/)

function findNDifferentCharacters(n: number) {
    for (let i = n; i < input.length; i++) {
        if (new Set(input.slice(i - n, i)).size == n) return i
    }
}

// part 1
console.log(findNDifferentCharacters(4))

// part 2
console.log(findNDifferentCharacters(14))
