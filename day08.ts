import {readFileSync} from "fs"

const input = readFileSync('day08.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.trim().split('').map(Number))

// part 1
function isVisible(x: number, y: number) {
    const h = input[y][x]

    let visible = true
    for (let x2 = x - 1; x2 >= 0; x2--) {
        if (input[y][x2] >= h) {
            visible = false
            break
        }
    }
    if (visible) return true

    visible = true
    for (let x2 = x + 1; x2 < input[0].length; x2++) {
        if (input[y][x2] >= h) {
            visible = false
            break
        }
    }
    if (visible) return true

    visible = true
    for (let y2 = y - 1; y2 >= 0; y2--) {
        if (input[y2][x] >= h) {
            visible = false
            break
        }
    }
    if (visible) return true

    visible = true
    for (let y2 = y + 1; y2 < input.length; y2++) {
        if (input[y2][x] >= h) {
            visible = false
            break
        }
    }
    return visible
}

let visible = 0
for (let x = 0; x < input.length; x++) {
    for (let y = 0; y < input[0].length; y++) {
        if (isVisible(x, y)) visible++
    }
}
console.log(visible)

// part 2
function scenicScore(x: number, y: number) {
    const h = input[y][x]

    let left = 0
    for (let x2 = x - 1; x2 >= 0; x2--) {
        left++
        if (input[y][x2] >= h) break
    }

    let right = 0
    for (let x2 = x + 1; x2 < input[0].length; x2++) {
        right++
        if (input[y][x2] >= h) break
    }

    let up = 0
    for (let y2 = y - 1; y2 >= 0; y2--) {
        up++
        if (input[y2][x] >= h) break
    }

    let down = 0
    for (let y2 = y + 1; y2 < input.length; y2++) {
        down++
        if (input[y2][x] >= h) break
    }

    return left*right*up*down
}

let maxScore = -Infinity
for (let x = 1; x < input.length - 1; x++) {
    for (let y = 1; y < input[0].length - 1; y++) {
        let score = scenicScore(x, y)
        if (score > maxScore) maxScore = score
    }
}
console.log(maxScore)
