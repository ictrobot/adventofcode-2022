import {readFileSync} from "fs"

const input = readFileSync('day15.input', 'utf-8')
    .split(/\r?\n/)
    .filter(x => x)
    .map(x => x.split(/[^-\d]+/).filter(x => x).map(Number))

const ranges: [sX: number, sY: number, r: number][] = []
const beacons = new Set<string>()
for (const [sX, sY, bX, bY] of input) {
    ranges.push([sX, sY,Math.abs(bX-sX)+Math.abs(bY-sY)])
    beacons.add(`${bX},${bY}`)
}

// part 1
function combineIntervals(intervals: [number, number][]): [number, number][] {
    if (intervals.length == 0) return []

    intervals.sort(([min1],  [min2]) => min1 - min2)

    const combined = [intervals[0]]
    for (let i = 1; i < intervals.length; i++) {
        const interval = intervals[i]
        const last = combined[combined.length - 1]

        if (interval[0] <= last[1]) {
            last[0] = Math.min(interval[0], last[0])
            last[1] = Math.max(interval[1], last[1])
        } else {
            combined.push(interval)
        }
    }

    return combined
}

function getIntervals(y: number) {
    const intervals: [number, number][] = []
    for (const [sX, sY, r] of ranges) {
        if (Math.abs(sY - y) > r) continue

        const minX = sX - (r - Math.abs(sY - y))
        const maxX = sX + (r - Math.abs(sY - y))
        intervals.push([minX, maxX])
    }

    return combineIntervals(intervals)
}

function cannotContainBeacon(y: number) {
    let beaconCount = 0
    for (const b of beacons) {
        if (Number(b.split(',')[1]) === y) beaconCount++
    }

    const intervalsSize = getIntervals(y)
        .map(([min, max]) => max + 1 - min)
        .reduce((x, y) => x + y, 0)

    return intervalsSize - beaconCount
}

// console.log(cannotContainBeacon(10))
console.log(cannotContainBeacon(2000000))

// part 2
function findBeacon(minCoord: number, maxCoord: number) {
    for (let y = minCoord; y <= maxCoord; y++) {
        const intervals = getIntervals(y)

        // getIntervals combines adjacent intervals, so
        // min - 1 && max + 1 cannot be present in another interval
        for (const [minX, maxX] of intervals) {
            if (minX-1 >= minCoord && minX-1 <= maxCoord) {
                return (minX - 1) * 4000000 + y
            } else if (maxX+1 >= minCoord && maxX+1 <= maxCoord) {
                return (maxX + 1) * 4000000 + y
            }
        }
    }
}

// console.log(findBeacon(0, 20))
console.log(findBeacon(0, 4000000))
