import {readFileSync} from "fs"

const input = readFileSync('day23.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

// can't store [number, number] in set, store as string
const elves = new Set<string>()
for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        if (input[y][x] === "#") elves.add(`${x},${y}`)
    }
}

// convert string back to coordinates
function coordinates(s: string) {
    const i = s.indexOf(',')
    return [Number(s.substring(0, i)), Number(s.substring(i + 1))]
}

// part 1
function simulateRound(elves: Set<string>, dirOffset = 0): [newElves: Set<string>, changed: boolean] {
    const dirs = ['N', 'S', 'W', 'E']
    dirs.push(...dirs.splice(0, dirOffset))

    const newElves = new Set<string>()

    const proposed: [string, string][] = [];
    const proposedCount = new Map<string, number>();

    for (let elf of elves) {
        const [x, y] = coordinates(elf)

        let neighbours = 0
        let north = true
        let south = true
        let west = true
        let east = true

        if (elves.has(`${x - 1},${y - 1}`)) {
            neighbours++
            north = false
            west = false
        }
        if (elves.has(`${x - 1},${y}`)) {
            neighbours++
            west = false
        }
        if (elves.has(`${x - 1},${y + 1}`)) {
            neighbours++
            south = false
            west = false
        }
        if (elves.has(`${x},${y - 1}`)) {
            neighbours++
            north = false
        }
        if (elves.has(`${x},${y + 1}`)) {
            neighbours++
            south = false
        }
        if (elves.has(`${x + 1},${y - 1}`)) {
            neighbours++
            north = false
            east = false
        }
        if (elves.has(`${x + 1},${y}`)) {
            neighbours++
            east = false
        }
        if (elves.has(`${x + 1},${y + 1}`)) {
            neighbours++
            south = false
            east = false
        }

        let n = elf;
        if (neighbours > 0) {
            for (const d of dirs) {
                if (d === "N" && north) {
                    n = `${x},${y - 1}`
                    break
                } else if (d === "S" && south) {
                    n = `${x},${y + 1}`
                    break
                } else if (d === "W" && west) {
                    n = `${x - 1},${y}`
                    break
                } else if (d === "E" && east) {
                    n = `${x + 1},${y}`
                    break
                }
            }
        }

        if (n === elf) {
            // faster to directly add to newElves
            newElves.add(elf)
            continue
        }

        proposed.push([elf, n])
        proposedCount.set(n, (proposedCount.get(n) ?? 0) + 1)
    }

    let changed = false
    for (let [elf, n] of proposed) {
        if (proposedCount.get(n) === 1) {
            newElves.add(n)
            changed = true
        } else {
            newElves.add(elf)
        }
    }

    return [newElves, changed]
}

function simulate(elves: Set<string>, rounds: number) {
    for (let r = 0; r < rounds; r++) {
        [elves] = simulateRound(elves, r % 4)
    }

    return elves
}

function countEmptyGround(elves: Set<string>) {
    const coords = Array.from(elves).map(coordinates)
    const minX = Math.min(...coords.map(c => c[0]))
    const maxX = Math.max(...coords.map(c => c[0]))
    const minY = Math.min(...coords.map(c => c[1]))
    const maxY = Math.max(...coords.map(c => c[1]))

    return (maxX - minX + 1) * (maxY - minY + 1) - elves.size
}

console.log(countEmptyGround(simulate(elves, 10)))

// part 2
function roundsUntilStable(elves: Set<string>) {
    for (let r = 0; ; r++) {
        let changed
        [elves, changed] = simulateRound(elves, r % 4)
        if (!changed) return r + 1
    }
}

console.log(roundsUntilStable(elves))
