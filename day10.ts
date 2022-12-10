import {readFileSync} from "fs"

const input = readFileSync('day10.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(' '))
    .map(x => [x[0], Number(x[1])] as [string, number])

// part 1
let x = 1;
const xDuring = [];
for (const [instr, n] of input) {
    xDuring.push(x)
    if (instr === "addx") {
        // addx takes 2 cycles, updating x after the 2nd cycle
        xDuring.push(x)
        x += n
    }
}

let signalStrength = 0;
for (let i = 19; i < xDuring.length; i+=40) {
    signalStrength += xDuring[i] * (i + 1)
}
console.log(signalStrength)

// part 2
let row = ""
for (let i = 0; i < xDuring.length; i++) {
    if (Math.abs((i % 40) - xDuring[i]) <= 1) {
        row += "#"
    } else {
        row += "."
    }

    if (i % 40 == 39) {
        console.log(row)
        row = ""
    }
}
