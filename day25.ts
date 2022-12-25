import {readFileSync} from "fs"

const input = readFileSync('day25.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)

const snafuDecodeTable: {[n: string]: number} = {"2": 2, "1": 1, "0": 0, "-": -1, "=": -2}
const snafuEncodeTable: {[n: number]: string} = {"2": "2", "1": "1", "0": "0", "-1": "-", "-2": "="}

function snafuDecode(s: string): number {
    let total = 0
    for (let i = 0; i < s.length; i++) {
        let c = s[s.length - 1 - i]
        total += (5 ** i) * snafuDecodeTable[c]
    }
    return total
}

function snafuEncode(n: number): string {
    const maxDigits = Math.floor(Math.log(n) / Math.log(5))
    let s = ""
    for (let i = maxDigits; i >= 0; i--) {
        let d = 5 ** i
        let v = Math.round(n / d)
        s += snafuEncodeTable[v]
        n -= v * d
    }
    return s
}

// part 1
console.log(snafuEncode(input.map(snafuDecode).reduce((x, y) => x + y, 0)))

// part 2 is completing all the previous puzzles
