const bitmap = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
const imgWidth = bitmap[0].length;
const imgHeight = bitmap.length;

function NeighbourExists(i, j) {
    if (i < 0 || i >= imgWidth || j < 0 || j >= imgHeight)
        return false;
    return true;
}

function EuclidianDistance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x1 - x2, 2)
        +
        Math.pow(y1 - y2, 2)
    );
}

function PaintBrush(i, j, color, radius) {
    // Square of size radius around (i,j) center
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            const neighbourX = j + x;
            const neighbourY = i + y;
            if (!NeighbourExists(neighbourX, neighbourY)) continue;

            const distance = EuclidianDistance(i, j, neighbourX, neighbourY);
            if (distance >= radius) continue;

            bitmap[neighbourY][neighbourX] = color;
        }
    }
}

console.log("Before: ", bitmap);
PaintBrush(1, 1, 1, 2);
console.log("After: ", bitmap);