import {readFileSync} from "fs"

const input = readFileSync('day20.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => Number(x))

function mix(original: number[], times = 1) {
    const mixed = original.map((num, pos) => ({num, pos}))

    for (let t = 0; t < times; t++) {
        for (let i = 0; i < mixed.length; i++) {
            const j = mixed.findIndex(({pos}) => pos === i);
            const [item] = mixed.splice(j, 1);
            mixed.splice((j + item.num) % mixed.length, 0, item);
        }
    }

    return mixed.map(({num}) => num)
}

function coordsSum(mixed: number[]) {
    let i = mixed.findIndex(x => x === 0)
    return [1000, 2000, 3000]
        .map(x => mixed[(x + i) % mixed.length])
        .reduce((x, y) => x + y)
}

console.log(coordsSum(mix(input))) // part 1
console.log(coordsSum(mix(input.map(x => x * 811589153), 10))) // part 2
