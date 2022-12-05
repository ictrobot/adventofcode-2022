import {readFileSync} from "fs"

const input = readFileSync('day05.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

const n = input.findIndex(x => x.indexOf('1') > 0)
const stacks = []
for (const i of input[n].trim().split(/\s+/).map(Number)) {
    const pos = -3 + (4 * i)
    const stack = []
    for (let j = n - 1; j >= 0; j--) {
        const c = input[j][pos]?.trim()
        if (c) stack.push(c)
    }
    stacks[i] = stack
}

const commands = input.slice(n+1)
    .map(x => x.split(/\D+/).filter(x => x).map(Number))

// part 1
const p1 = stacks.map(x => x.slice())
for (const [count, from, to] of commands) {
    for (let i = 0; i < count; i ++) {
        p1[to].push(p1[from].pop()!)
    }
}
console.log(p1.map(x => x.at(-1)).join(''))

// part 2
const p2 = stacks.map(x => x.slice())
for (const [count, from, to] of commands) {
    p2[to].push(...p2[from].splice(-count))
}
console.log(p2.map(x => x.at(-1)).join(''))
