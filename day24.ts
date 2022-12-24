import {readFileSync} from "fs"

const input = readFileSync('day24.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(''))

const walls: boolean[][] = input.map(l => l.map(c => c === '#'))

const blizzards = input.flatMap((l, y) => l.flatMap((c, x) =>
    c === '^' || c === '>' || c === 'v' || c === '<' ? [[x, y, c]] as [[number, number, typeof c]] : []
))

// part 1
const open: boolean[][][] = [input.map(l => l.map(c => c === '.'))]

function getOpen(minute: number) {
    const deltas = {'^': [0, -1], '>': [1, 0], 'v': [0, 1], '<': [-1, 0]}

    for (let i = open.length; i <= minute; i++) {
        open[i] = walls.map(x => x.map(y => !y))

        for (let [bX, bY, dir] of blizzards) {
            bX = 1 + mod(bX + (i * deltas[dir][0]) - 1, input[0].length - 2)
            bY = 1 + mod(bY + (i * deltas[dir][1]) - 1, input.length - 2)
            open[i][bY][bX] = false
        }
    }

    return open[minute]
}

function mod(n: number, d: number) {
    return ((n % d) + d) % d
}

function search(start: [number, number], end: [number, number], startMin = 0) {
    const queue = [[startMin, ...start]]
    const visited: boolean[][][] = []

    while (queue.length) {
        const [minute, x, y] = queue.shift()!

        if (visited[minute]?.[x]?.[y]) continue
        visited[minute] ??= []
        visited[minute][x] ??= []
        visited[minute][x][y] = true

        if (x === end[0] && y === end[1]) return minute

        const open = getOpen(minute+1)
        if (open[y][x+1]) queue.push([minute+1, x+1, y])
        if (open[y][x-1]) queue.push([minute+1, x-1, y])
        if (open[y+1]?.[x]) queue.push([minute+1, x, y+1])
        if (open[y-1]?.[x]) queue.push([minute+1, x, y-1])
        if (open[y][x]) queue.push([minute+1, x, y])
    }
}

const entrance: [number, number] = [input[0].indexOf('.'), 0]
const exit: [number, number] = [input[input.length-1].indexOf('.'), input.length - 1]

const entranceToExit = search(entrance, exit)
console.log(entranceToExit)

// part 2
const backToEntrance = search(exit, entrance, entranceToExit)
const backToExit = search(entrance, exit, backToEntrance)
console.log(backToExit)
