import {readFileSync} from "fs"

const input = readFileSync('day07.input', 'utf-8')
    .split(/\r?\n/)

let path: string[] = []
const sizes = new Map<string, number>()
for (const l of input) {
    if (l.startsWith('$ cd')) {
        const d = l.substring(5)
        if (d === '/') {
            path = []
        } else if (d === '..') {
            path.pop()
        } else {
            path.push(d)
        }
    } else if (!l.startsWith('$')) {
        const [s] = l.split(" ")
        if (s != "dir") {
            for (let i = 0; i <= path.length; i++) {
                const p = '/' + path.slice(0, i).join('/')
                sizes.set(p, Number(s) + (sizes.get(p) ?? 0))
            }
        }
    }
}

// part 1
console.log(Array.from(sizes.values())
    .filter(v => v <= 100000)
    .reduce((x, y) => x + y, 0))

// part 2
const needed = sizes.get('/')! - 40000000
console.log(Math.min(...Array.from(sizes.values()).filter(v => v >= needed)))
