import {readFileSync} from "fs"

const input = readFileSync('day11.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

interface Monkey {
    starting: number[],

    operation: string,
    operand: string,

    divisibleBy: number,
    trueMonkey: number,
    falseMonkey: number,
}

const monkeys: Monkey[] = [];

while (input.length >= 6) {
    const m = input.splice(0, 6)

    monkeys.push({
        starting: m[1].split(/[^\d+]/).filter(x => x).map(Number),

        operation: m[2].split(' ').at(-2)!,
        operand: m[2].split(' ').at(-1)!,

        divisibleBy: Number(m[3].split(' ').at(-1)),
        trueMonkey: Number(m[4].split(' ').at(-1)),
        falseMonkey: Number(m[5].split(' ').at(-1)),
    })
}

function monkeyBusiness(monkeys: Monkey[], rounds: number, worryLevel = 3) {
    const items = monkeys.map(m => m.starting.slice())
    const inspected = monkeys.map(_ => 0)

    const divisor = monkeys.map(m => m.divisibleBy)
        .reduce((x, y) => x * y, 1)

    for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < monkeys.length; i++) {
            const m = monkeys[i]

            const oldItems = items[i]
            inspected[i] += oldItems.length
            items[i] = []

            for (let item of oldItems) {
                let operand = Number(m.operand)
                if (isNaN(operand)) operand = item

                if (m.operation === '*') {
                    item *= operand
                } else if (m.operation === '+') {
                    item += operand
                }

                item = Math.floor(item / worryLevel)
                item %= divisor

                if (item % m.divisibleBy === 0) {
                    items[m.trueMonkey].push(item)
                } else {
                    items[m.falseMonkey].push(item)
                }
            }
        }
    }

    inspected.sort((x, y) => y - x)
    return inspected[0] * inspected[1]
}

console.log(monkeyBusiness(monkeys, 20))
console.log(monkeyBusiness(monkeys, 10000, 1))
