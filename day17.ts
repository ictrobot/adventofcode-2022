import {readFileSync} from "fs"

const input = readFileSync('day17.input', 'utf-8').trim()
    .split('')
    .map(x => x === ">" ? [1, 0] as [number, number] : [-1, 0] as [number, number])

const DOWN: [number, number] = [0, -1]

function spawnRock(grid: boolean[][], i: bigint): [number, number][] {
    const bottom = grid.length + 3
    if (i % 5n === 0n) {
        return [[2, bottom], [3, bottom], [4, bottom], [5, bottom]]
    } else if (i % 5n === 1n) {
        return [[3, bottom], [2, bottom+1], [3, bottom+1], [4, bottom+1], [3, bottom+2]]
    } else if (i % 5n === 2n) {
        return [[2, bottom], [3, bottom], [4, bottom], [4, bottom+1], [4, bottom+2]]
    } else if (i % 5n === 3n) {
        return [[2, bottom], [2, bottom+1], [2, bottom+2], [2, bottom+3]]
    } else { // if (i % 5n === 4n)
        return [[2, bottom], [3, bottom], [2, bottom+1], [3, bottom+1]]
    }
}

function canMove(grid: boolean[][], r: [number, number][], [dx, dy]: [number, number]) {
    return r.every(([x, y]) => x+dx < 7 && x+dx >= 0 && y+dy >= 0 && !grid[y+dy]?.[x+dx])
}

function move(r: [number, number][], [dx, dy]: [number, number]) {
    for (const d of r) {
        d[0] += dx
        d[1] += dy
    }
}

function calculateHeight(rocks: bigint) {
    // grid[y][x]
    let grid: boolean[][] = []

    let movement = 0 // index into input
    let height = 0n // add grid.length for the total height

    // map of JSON encoded grids to the last time they occurred
    let prev: {[s: string]: [rock: bigint, height: bigint]} = {}

    for (let rock = 0n; rock < rocks; rock++) {
        const r = spawnRock(grid, rock)

        while (true) {
            // move rock left or right if possible
            const m = input[movement]
            movement = (movement + 1) % input.length
            if (canMove(grid, r, m)) {
                move(r, m)
            }

            // move rock down or break
            if (canMove(grid, r, DOWN)) {
                move(r, DOWN)
            } else {
                break
            }
        }

        // add rock to the grid
        for (const [x, y] of r) {
            grid[y] ??= []
            grid[y][x] = true
        }

        // only store last 100 rows of grid
        while (grid.length > 100) {
            grid.shift()
            height++
        }

        // check if grid has repeated
        const json = JSON.stringify(grid)
        if (prev[json]) {
            const [prevRock, prevHeight] = prev[json]

            const rockDiff = rock - prevRock
            const multiples = (rocks - rock) / rockDiff
            rock += rockDiff * multiples

            const heightDiff = height + BigInt(grid.length) - prevHeight
            height += heightDiff * multiples

            prev = {}
        } else {
            prev[json] = [rock, height + BigInt(grid.length)]
        }
    }

    return height + BigInt(grid.length)
}

console.log(calculateHeight(2022n).toString()) // part 1
console.log(calculateHeight(1000000000000n).toString()) // part 2
