import {readFileSync} from "fs"

const input = readFileSync('day14.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(' -> ').map(y => y.split(',').map(Number) as [number, number]))

const ROCK = "R"
const SAND = "S"
type Material = typeof ROCK | typeof SAND

const grid: Material[][] = []
let maxY = 0
for (const l of input) {
    for (let i = 1; i < l.length; i++) {
        let [x1, y1] = l[i - 1]
        let [x2, y2] = l[i]
        maxY = Math.max(maxY, y1, y2)

        if (x1 === x2) {
            grid[x1] ??= []
            for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
                grid[x1][y] = ROCK
            }
        } else if (y1 === y2) {
            for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
                grid[x] ??= []
                grid[x][y1] = ROCK
            }
        } else {
            throw new Error("x1 != x2 && y1 != y2")
        }
    }
}

function dropSand(grid: Material[][], abyssY: number, floorY: number) {
    let [x, y] = [500, 0]
    if (grid[x]?.[y]) return false // source blocked

    while (y + 1 < floorY) { // reached infinite floor
        if (y >= abyssY) return false // reached abyss

        if (!grid[x]?.[y + 1]) { // move down
            y++
        } else if (!grid[x - 1]?.[y + 1]) { // move down & left
            x--
            y++
        } else if (!grid[x + 1]?.[y + 1]) { // move down & right
            x++
            y++
        } else {
            break
        }
    }

    grid[x] ??= []
    grid[x][y] = SAND
    return true
}

function sandCount(abyssY: number, floorY: number) {
    const g = grid.map(x => x.slice())

    let i = 0
    while (dropSand(g, abyssY, floorY)) i++
    return i
}

console.log(sandCount(maxY + 1, Infinity))
console.log(sandCount(Infinity, maxY + 2))
