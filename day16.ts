import {readFileSync} from "fs"

const input = readFileSync('day16.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

// refer to valves as indexes so state is 3d array, which is faster than key
// lookups in objects or maps
const valves: string[] = input.map(l => l.split(' ')[1])
const startValve = valves.indexOf('AA')

const rates: number[] = []
const rateValves: number[] = []
const tunnels: number[][] = []
for (let valveIdx = 0; valveIdx < input.length; valveIdx++) {
    rates[valveIdx] = Number(input[valveIdx].match(/\d+/))
    if (rates[valveIdx] > 0) rateValves.push(valveIdx)

    tunnels[valveIdx] = input[valveIdx]
        .replaceAll(',', '').split(' ').slice(9)
        .map(v => valves.indexOf(v))
}

// releasing[open] = pressure/min released
// open is a bitset representing which valves are open
const releasing: number[] = []
const maxOpen = 1 << rateValves.length
for (let open = 0; open < maxOpen; open++) {
    let total = 0
    for (let i = 0; i < rateValves.length; i++) {
        if ((open & (1 << i)) !== 0) total += rates[rateValves[i]]
    }
    releasing[open] = total
}

// states[min][pos][open] = max released
const states: number[][][] = []
states[0] ??= []
states[0][startValve] ??= []
states[0][startValve][0] = 0

for (let min = 1; min <= 30; min++) {
    states[min] ??= []
    for (let pos = 0; pos < valves.length; pos++) {
        states[min][pos] ??= []
        const valveBit = rates[pos] ? (1 << rateValves.indexOf(pos)) : 0

        for (let open = 0; open < maxOpen; open++) {
            let max = -Infinity

            // opened valve
            if ((valveBit & open) !== 0) {
                const prevOpen = open & ~valveBit
                const released = states[min - 1][pos]?.[prevOpen] ?? -Infinity
                max = released + releasing[prevOpen]
            }

            // moved location
            for (const prev of tunnels[pos]) {
                const released = states[min - 1][prev]?.[open] ?? -Infinity
                max = Math.max(max, released + releasing[open])
            }

            states[min][pos][open] = max
        }
    }
}

let p1 = -Infinity
for (let pos = 0; pos < valves.length; pos++) {
    for (let open = 0; open < maxOpen; open++) {
        p1 = Math.max(p1, states[30][pos][open])
    }
}
console.log(p1)


// part 2

// minute26Max[open] = max released
const minute26Max: number[] = []
for (let open = 0; open < maxOpen; open++) {
    let max = -Infinity
    for (let pos = 0; pos < valves.length; pos++) {
        max = Math.max(max, states[26][pos][open] ?? -Infinity)
    }
    minute26Max[open] = max
}

let p2 = 0
for (let youOpen = 0; youOpen < maxOpen; youOpen++) {
    const youMax = minute26Max[youOpen]
    if (youMax <= 0) continue

    for (let elephantOpen = youOpen + 1; elephantOpen < maxOpen; elephantOpen++) {
        if ((youOpen & elephantOpen) !== 0) continue // can't both open same valves

        const elephantMax = minute26Max[elephantOpen]
        if (elephantMax <= 0) continue

        p2 = Math.max(p2, youMax + elephantMax)
    }
}
console.log(p2)
