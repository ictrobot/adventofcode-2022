import {readFileSync} from "fs"

type Input = number | Input[]

const input = readFileSync('day13.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => JSON.parse(x) as Input)

// part 1
function compare(left: Input, right: Input): boolean | undefined {
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
            const c = compare(left[i], right[i])
            if (c !== undefined) return c
        }
        return left.length == right.length ? undefined : left.length < right.length
    } else if (Array.isArray(left)) {
        return compare(left, [right])
    } else if (Array.isArray(right)) {
        return compare([left], right)
    } else {
        return left == right ? undefined : left < right
    }
}

function group<T>(arr: T[], size: number): T[][] {
    return arr.reduce((prev, x) => {
        const last = prev.at(-1)
        if (last && last.length < size) {
            last.push(x)
        } else {
            prev.push([x])
        }
        return prev
    }, [] as T[][])
}

console.log(group(input, 2)
    .reduce((total, [l, r], i) => total + (compare(l, r) ? i + 1 : 0), 0))

// part 2
const dividers = [[[2]], [[6]]]

const p2 = [...input, ...dividers]
p2.sort((x, y) => compare(x, y) ? -1 : 1)

console.log(dividers.map(x => p2.indexOf(x) + 1)
    .reduce((p, x) => p * x, 1))
