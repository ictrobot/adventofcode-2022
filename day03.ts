import {readFileSync} from "fs"

const input = readFileSync('day03.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

function overlapPriority(...strings: string[]): number {
    const [first] = strings.splice(0, 1)
    const sets = strings.map(o => new Set(o))
    const every = Array.from(new Set(first))
        .filter(c => sets.every(set => set.has(c)))

    if (every.length !== 1) throw new Error('More than one shared item!')

    const c = every[0].charCodeAt(0)
    if (c >= 65 && c <= 90) return c - 38
    return c - 96
}

// part 1
console.log(input
    .map(s => overlapPriority(s.slice(0, s.length / 2), s.slice(s.length / 2)))
    .reduce((x, y) => x + y, 0)
)

// part 2
let total = 0
while (input.length > 0) {
    total += overlapPriority(...input.splice(0, 3))
}
console.log(total)
