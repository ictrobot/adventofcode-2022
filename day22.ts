import {readFileSync} from "fs"

type Direction = typeof RIGHT | typeof DOWN |typeof LEFT | typeof UP

const RIGHT = 0
const DOWN = 1
const LEFT = 2
const UP = 3

const DELTAS: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
]

const [mapStr, pathStr] = readFileSync('day22.input', 'utf-8')
    .trimEnd()
    .split(/\r?\n\r?\n/)

// true = open, false = solid, undefined = outside grid
const grid: boolean[][] = [] // grid[y][x]
for (const line of mapStr.split(/\r?\n/)) {
    const row: boolean[] = []
    for (let i = 0; i < line.length; i++) {
        if (line[i] === ".") {
            row[i] = true
        } else if (line[i] === "#") {
            row[i] = false
        }
    }
    grid.push(row)
}

const path = pathStr.split(/(?<=\d)(?=[LR])|(?<=[LR])(?=\d)/)
    .map(x => x.match(/^\d+$/) ? Number(x) : x)

// part 1
function password(nextFn = next) {
    let x = grid[0].findIndex(x => x)
    let y = 0
    let dir: Direction = RIGHT

    for (const instr of path) {
        if (typeof instr === "string") { // rotate
            if (instr === "L") {
                dir = mod(dir - 1, 4) as Direction
            } else if (instr === "R") {
                dir = mod(dir + 1, 4) as Direction
            }
        } else { // move
            for (let i = 0; i < instr; i++) {
                const [nX, nY, nDir] = nextFn(x, y, dir)
                if (!grid[nY][nX]) break
                [x, y, dir] = [nX, nY, nDir]
            }
        }
    }

    return ((y + 1) * 1000) + ((x + 1) * 4) + dir
}

function mod(n: number, d: number) {
    return ((n % d) + d) % d
}

function next(x: number, y: number, dir: Direction): [number, number, Direction] {
    let nX = mod(x + DELTAS[dir][0], grid.length)
    let nY = mod(y + DELTAS[dir][1], grid.length)

    while (grid[nY]?.[nX] === undefined) {
        nX = mod(nX + DELTAS[dir][0], grid.length)
        nY = mod(nY + DELTAS[dir][1], grid.length)
    }

    return [nX, nY, dir]
}

console.log(password())

// part 2
// doesn't work for the sample, probably only works for my input
// face layout:
//  01
//  2
// 43
// 5

type Face = 0 | 1 | 2 | 3 | 4 | 5

const faceSize = 50
const faces: {
    minX: number, minY: number,
    [RIGHT]?: (x: number, y: number) => [face: Face, x: number, y: number, dir: Direction],
    [DOWN]?: (x: number, y: number) => [face: Face, x: number, y: number, dir: Direction],
    [LEFT]?: (x: number, y: number) => [face: Face, x: number, y: number, dir: Direction],
    [UP]?: (x: number, y: number) => [face: Face, x: number, y: number, dir: Direction],
}[] = [
    { // face 0
        minX: 50, minY: 0,
        [LEFT]: (x, y) => ([4, 0, 49-y, RIGHT]),
        [UP]: (x, y) => ([5, 0, x, RIGHT]),
    }, { // face 1
        minX: 100, minY: 0,
        [RIGHT]: (x, y) => ([3, 49, 49-y, LEFT]),
        [DOWN]: (x, y) => ([2, 49, x, LEFT]),
        [UP]: (x, y) => ([5, x, 49, UP]),
    }, { // face 2
        minX: 50, minY: 50,
        [RIGHT]: (x, y) => ([1, y, 49, UP]),
        [LEFT]: (x, y) => ([4, y, 0, DOWN]),
    }, { // face 3
        minX: 50, minY: 100,
        [RIGHT]: (x, y) => ([1, 49, 49-y, LEFT]),
        [DOWN]: (x, y) => ([5, 49, x, LEFT]),
    }, { // face 4
        minX: 0, minY: 100,
        [LEFT]: (x, y) => ([0, 0, 49-y, RIGHT]),
        [UP]: (x, y) => ([2, 0, x, RIGHT]),
    }, { // face 5
        minX: 0, minY: 150,
        [RIGHT]: (x, y) => ([3, y, 49, UP]),
        [DOWN]: (x, y) => ([1, x, 0, DOWN]),
        [LEFT]: (x, y) => ([0, y, 0, DOWN]),
    }
]

function nextP2(x: number, y: number, dir: Direction): [number, number, Direction] {
    const nX = x + DELTAS[dir][0]
    const nY = y + DELTAS[dir][1]
    if (grid[nY]?.[nX] !== undefined) return [nX, nY, dir] // doesn't wrap

    const face = faces.findIndex(
        f => x >= f.minX && x < f.minX + 50 && y >= f.minY && y < f.minY + 50
    )
    if (face === -1) throw new Error("face not found")

    const fn = faces[face][dir]
    if (!fn) throw new Error(`face ${face} missing mapping fn for dir ${dir}`)

    const [newFace, faceX, faceY, newDir] = fn(mod(x, faceSize), mod(y, faceSize))
    return [faces[newFace].minX + faceX, faces[newFace].minY + faceY, newDir]
}

console.log(password(nextP2))
