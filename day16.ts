import {readFileSync} from "fs"

const input = readFileSync('day16.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

const valves: string[] = []
const rateValves: string[] = []
const rates: {[v: string]: number} = {}
const reverseTunnels: {[v: string]: string[]} = {}

for (const l of input) {
    const valve = l.split(' ')[1]
    valves.push(valve)

    const rate = Number(l.match(/\d+/))
    if (rate > 0) {
        rateValves.push(valve)
        rates[valve] = rate
    }

    const tunnels = l.replaceAll(',', '').split(' ').slice(9)
    for (const t of tunnels) {
        reverseTunnels[t] ??= []
        reverseTunnels[t].push(valve)
    }
}

// releasing[open] = pressure/min released
const releasing: number[] = []
const maxOpen = (1 << rateValves.length) - 1
for (let open = 0; open <= maxOpen; open++) {
    let total = 0
    for (let i = 0; i < rateValves.length; i++) {
        if ((open & (1 << i)) !== 0) total += rates[rateValves[i]]
    }
    releasing[open] = total
}

// states[min][pos][open] = max released
const states: {[min: number]: {[pos: string]: {[open: number]: number}}} = {}
states[0] ??= {}
states[0]['AA'] ??= {}
states[0]['AA'][0] = 0

for (let min = 1; min <= 30; min++) {
    states[min] ??= {}
    for (const pos of valves) {
        states[min][pos] ??= {}
        let valveBit = rates[pos] ? (1 << rateValves.indexOf(pos)) : 0

        for (let open = 0; open <= maxOpen; open++) {
            let max = -Infinity

            // opened valve
            if (valveBit) {
                let prevOpen = open & ~valveBit
                let r = states[min - 1][pos]?.[prevOpen]
                if (r !== undefined) max = r + releasing[prevOpen]
            }

            // moved location
            for (const prev of reverseTunnels[pos]) {
                let r = states[min - 1][prev]?.[open]
                if (r !== undefined) max = Math.max(max, r + releasing[open])
            }

            if (max >= 0) states[min][pos][open] = max
        }
    }
}

console.log(Math.max(...Object.values(states[30]).flatMap(Object.values)))


// part 2

// minute26Max[open] = max released
const minute26Max: number[] = []
for (let open = 0; open <= maxOpen; open++) {
    let max = -Infinity;
    for (const pos of valves) {
        max = Math.max(max, states[26][pos][open] ?? -Infinity)
    }
    if (max >= 0) minute26Max[open] = max
}

let p2 = 0
for (let youOpen = 0; youOpen <= maxOpen; youOpen++) {
    let youMax = minute26Max[youOpen]
    if (youMax === undefined) continue // state not reachable

    for (let elephantOpen = 0; elephantOpen <= maxOpen; elephantOpen++) {
        if ((youOpen & elephantOpen) !== 0) continue // can't both open same valves

        let elephantMax = minute26Max[elephantOpen]
        if (elephantMax === undefined) continue // state not reachable

        p2 = Math.max(p2, youMax + elephantMax)
    }
}

console.log(p2)
