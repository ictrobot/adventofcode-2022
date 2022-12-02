import {readFileSync} from "fs";

const input = readFileSync('day02.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.trim().split(" "))

const Rock = 1
const Paper = 2
const Scissors = 3

// part 1
let total = 0
for (let [o, y] of input) {
    const opponent = {A: Rock, B: Paper, C: Scissors}[o]
    const you = {X: Rock, Y: Paper, Z: Scissors}[y]

    let bonus = 0;
    if ((you == Rock && opponent == Scissors) || (you == Paper && opponent == Rock) || (you == Scissors && opponent == Paper)) {
        bonus = 6
    } else if (you == opponent) {
        bonus = 3
    }
    total += you! + bonus
}
console.log(total)

// part 2
total = 0
for (let [o, outcome] of input) {
    const opponent = {A: Rock, B: Paper, C: Scissors}[o]

    let you;
    let bonus;
    if (outcome == "Z") { // win
        you = opponent == Paper ? Scissors : opponent == Rock ? Paper : Rock
        bonus = 6
    } else if (outcome == "Y") { // draw
        you = opponent
        bonus = 3
    } else { // lose
        you = opponent == Paper ? Rock : opponent == Rock ? Scissors : Paper
        bonus = 0
    }
    total += you! + bonus
}
console.log(total)
