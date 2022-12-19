import {readFileSync} from "fs"

type Blueprint = {num: number, costs: number[][]}

const ORE = 0
const CLAY = 1
const OBSIDIAN = 2
const GEODE = 3

const input: Blueprint[] = readFileSync('day19.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(/\D+/).filter(x => x))
    .map(x => ({
        num: Number(x[0]),
        costs: [
            [Number(x[1]), 0, 0, 0], // ore robot
            [Number(x[2]), 0, 0, 0], // clay robot
            [Number(x[3]), Number(x[4]), 0, 0], // obsidian robot
            [Number(x[5]), 0, Number(x[6]), 0], // geode robot
        ]
    }))

function maxGeodes(b: Blueprint, runtime: number) {
    // it's not worth having more e.g. ore robots than ore can be used a minute
    const maxRobots = [
        Math.max(...b.costs.map(x => x[ORE] ?? 0)),
        Math.max(...b.costs.map(x => x[CLAY] ?? 0)),
        Math.max(...b.costs.map(x => x[OBSIDIAN] ?? 0)),
        Infinity // no cap on geode robots
    ]

    let maxFound = 0

    const search = (minute: number, robots: number[], resources: number[]) => {
        let remaining = runtime - minute
        let geodes = resources[GEODE] + (remaining * robots[GEODE])
        maxFound = Math.max(maxFound, geodes)

        // no point building a robot in the last minute
        if (remaining <= 1) return

        // calculate the maximum number of geodes if we could build a geode
        // robot every minute from now - if it is less than or equal to the max
        // already found, stop
        if ((geodes + (geodes + remaining)) * (remaining + 1) / 2 <= maxFound) {
            return
        }

        // try craft geode robot first
        for (const type of [GEODE, ORE, CLAY, OBSIDIAN]) {
            // check if we already have enough robots for the type
            if (robots[type] == maxRobots[type]) continue

            // calculate how many minutes we would need to wait to build the
            // given robot type without building any other robots in between
            let mins = 0
            for (let i = 0; i < 4; i++) {
                if (resources[i] >= b.costs[type][i]) continue
                mins = Math.max(mins, Math.ceil((b.costs[type][i] - resources[i]) / robots[i]))
            }
            // takes a minute to build the robot
            mins++
            // check if we can build the robot before the end
            if (minute + mins > runtime) continue

            // continue the search after the new robot is built
            const newRobots = robots.slice()
            newRobots[type]++

            const newResources = resources.slice()
            for (let i = 0; i < 4; i++) {
                newResources[i] += (robots[i] * mins) - b.costs[type][i]
            }

            search(minute + mins, newRobots, newResources)

            // if we succeeded in building a geode robot straight away,
            // assume that was the optimal path for this node
            if (mins === 1 && type === GEODE) break
        }
    }

    search(0, [1, 0, 0, 0], [0, 0, 0, 0])
    return maxFound
}

// part 1
console.log(input
    .map(b => b.num * maxGeodes(b, 24))
    .reduce((x, y) => x + y, 0))

// part 2
console.log(input.slice(0, 3)
    .map(b => maxGeodes(b, 32))
    .reduce((x, y) => x * y, 1))
