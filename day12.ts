import {readFileSync} from "fs"

const input = readFileSync('day12.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(l => l.trim().split('').map(c => c.charCodeAt(0) - 97))

let start: [number, number] = [0, 0]
let end: [number, number] = [0, 0]
let aCoords: [number, number][] = []
for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
        if (input[y][x] === 83 - 97) { // S
            start = [x, y]
            input[y][x] = 0
        } else if (input[y][x] === 69 - 97) { // E
            end = [x, y]
            input[y][x] = 25
        }

        if (input[y][x] === 0) aCoords.push([x, y])
    }
}

function findShortestPath(...starts: [number, number][]) {
    let queue: [number, number, number][] = starts.map(s => [0, ...s])
    let visited: {[k: string]: boolean} = {}
    while (queue.length) {
        let [len, x, y] = queue.shift()!
        let key = x + ',' + y
        if (visited[key]) continue
        visited[key] = true

        if (x == end[0] && y == end[1]) return len

        let h = input[y][x]
        const mov = (X: number, Y: number) => {
            const H = input[Y]?.[X]
            if (H !== undefined && H <= h + 1) queue.push([len + 1, X, Y])
        }
        mov(x, y + 1)
        mov(x, y - 1)
        mov(x + 1, y)
        mov(x - 1, y)

        queue.sort(([h], [H]) => h - H)
    }
}

console.log(findShortestPath(start))
console.log(findShortestPath(...aCoords))
