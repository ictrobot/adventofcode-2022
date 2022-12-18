import {readFileSync} from "fs"

const input = readFileSync('day18.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(l => l.split(',').map(Number))

const grid: boolean[][][] = []
for (const [x, y, z] of input) {
    grid[x] ??= []
    grid[x][y] ??= []
    grid[x][y][z] = true
}

// part 1
function* neighbours(x: number, y: number, z: number): IterableIterator<[number, number, number]> {
    yield [x + 1, y, z]
    yield [x - 1, y, z]
    yield [x, y + 1, z]
    yield [x, y - 1, z]
    yield [x, y, z + 1]
    yield [x, y, z - 1]
}

let p1 = 0
for (const [x, y, z] of input) {
    for (const [X, Y, Z] of neighbours(x, y, z)) {
        if (!grid[X]?.[Y]?.[Z]) p1++
    }
}
console.log(p1)

// part 2
let minX = Math.min(...input.map(([x, y, z]) => x)) - 1
let minY = Math.min(...input.map(([x, y, z]) => y)) - 1
let minZ = Math.min(...input.map(([x, y, z]) => z)) - 1
let maxX = Math.max(...input.map(([x, y, z]) => x)) + 1
let maxY = Math.max(...input.map(([x, y, z]) => y)) + 1
let maxZ = Math.max(...input.map(([x, y, z]) => z)) + 1

const queue: [number, number, number][] = [[minX, minY, minZ]]
const visited: boolean[][][] = []

let p2 = 0
while (queue.length) {
    const [x, y, z] = queue.shift()!

    if (visited[x]?.[y]?.[z]) continue
    visited[x] ??= []
    visited[x][y] ??= []
    visited[x][y][z] = true

    for (const [X, Y, Z] of neighbours(x, y, z)) {
        if (grid[X]?.[Y]?.[Z]) {
            p2++
        } else if (X >= minX && X <= maxX && Y >= minY && Y <= maxY && Z >= minZ && Z <= maxZ) {
            queue.push([X, Y, Z])
        }
    }
}
console.log(p2)
