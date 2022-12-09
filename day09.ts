import {readFileSync} from "fs"

type Pos = {x: number, y: number}

const input = readFileSync('day09.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(' '))
    .map(x => [x[0], Number(x[1])] as [string, number])

function moveHead(h: Pos, d: string) {
    if (d === "U") { // up
        h.y++
    } else if (d === "D") { // down
        h.y--
    } else if (d === "L") { // left
        h.x--
    } else if (d === "R") { // right
        h.x++
    } else {
        throw new Error("Invalid direction")
    }
}

function moveTail(h: Pos, t: Pos) {
    let x = h.x - t.x
    let y = h.y - t.y
    if (Math.abs(x) <= 1 && Math.abs(y) <= 1) {
        return // no-op, touching
    }

    t.x += Math.sign(x)
    t.y += Math.sign(y)
}

function simulate(numTails: number = 1): number {
    const h = {x: 0, y: 0}
    const tails = [...Array(numTails)].map(_ => ({x: 0, y: 0}))

    const visited = new Map<string, boolean>();
    for (const [d, n] of input) {
        for (let i = 0; i < n; i++) {
            moveHead(h, d)

            let prev = h
            for (const t of tails) {
                moveTail(prev, t)
                prev = t
            }

            visited.set(`${prev.x},${prev.y}`, true)
        }
    }

    return visited.size
}

console.log(simulate())
console.log(simulate(9))
