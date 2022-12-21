import {readFileSync} from "fs"

const input = readFileSync('day21.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.replace(':', '').split(' '))

const nums = new Map<string, number>();
const ops = new Map<string, string[]>();

for (const l of input) {
    if (l.length === 2) {
        nums.set(l[0], Number(l[1]))
    } else {
        ops.set(l[0], l.slice(1))
    }
}

// part 1
function evaluate(nums: Map<string, number>, ops: Map<string, string[]>) {
    const results = new Map(nums)
    const queue = Array.from(ops.keys())

    while (queue.length) {
        const monkey = queue.shift()!
        const [m1, op, m2] = ops.get(monkey)!

        if (!results.has(m1) || !results.has(m2)) {
            queue.push(monkey)
            continue
        }

        const [lhs, rhs] = [results.get(m1)!, results.get(m2)!]
        if (op === "+") {
            results.set(monkey, lhs + rhs)
        } else if (op === "-") {
            results.set(monkey, lhs - rhs)
        } else if (op === "*") {
            results.set(monkey, lhs * rhs)
        } else if (op === "/") {
            results.set(monkey, lhs / rhs)
        }
    }

    return results
}

console.log(evaluate(nums, ops).get('root'))

// part 2
function makeEqual(results: Map<string, number>, ops: Map<string, string[]>, monkey: string, target = NaN): number {
    if (monkey === "humn") return target

    const [m1, op, m2] = ops.get(monkey)!

    if (!Number.isNaN(results.get(m1))) {
        // lhs fixed, rhs changed by humn input
        let lhs = results.get(m1)!

        if (op === "+") {
            target -= lhs
        } else if (op === "-") {
            target = lhs - target
        } else if (op === "*") {
            target /= lhs
        } else if (op === "/") {
            target = lhs / target
        } else if (op === "=") {
            target = lhs
        } else {
            throw new Error("Unknown op " + op)
        }

        return makeEqual(results, ops, m2, target)
    } else {
        // rhs fixed, lhs changed by humn input
        let rhs = results.get(m2)!

        if (op === "+") {
            target -= rhs
        } else if (op === "-") {
            target += rhs
        } else if (op === "*") {
            target /= rhs
        } else if (op === "/") {
            target *= rhs
        } else if (op === "=") {
            target = rhs
        } else {
            throw new Error("Unknown op " + op)
        }

        return makeEqual(results, ops, m1, target)
    }
}

const numsP2 = new Map(nums)
numsP2.set('humn', NaN)

const opsP2 = new Map(ops)
opsP2.set('root', [ops.get('root')![0], '=', ops.get('root')![2]])

console.log(makeEqual(evaluate(numsP2, opsP2), opsP2, "root"))
