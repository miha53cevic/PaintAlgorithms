const bitmap = [[0, 0, 0], [1, 1, 0], [0, 0, 0]];
const imgWidth = bitmap[0].length;
const imgHeight = bitmap.length;

function NeighbourExists(i, j) {
    if (i < 0 || i >= imgWidth || j < 0 || j >= imgHeight)
        return false;
    return true;
}

function IsValid(i, j, oldC, newC) {
    if (!NeighbourExists(i, j))
        return false;
    const color = bitmap[i][j];
    if (color != oldC || color == newC)
        return false;
    return true;
}

function DFSIterativeFloodFill(initial_i, initial_j, oldC, newC) {
    const stack = [];
    stack.push([initial_i, initial_j]);
    while (stack.length > 0) {
        const [i, j] = stack.pop();
        if (!IsValid(i, j, oldC, newC))
            continue;
        bitmap[i][j] = newC;
        stack.push([i - 1, j    ]);
        stack.push([i + 1, j    ]);
        stack.push([i,     j - 1]);
        stack.push([i,     j + 1]);
    }
}

function BFSIterativeFloodFill(initial_i, initial_j, oldC, newC) {
    const queue = [];
    queue.push([initial_i, initial_j]);
    while (queue.length > 0) {
        const [i, j] = queue.shift();
        if (!IsValid(i, j, oldC, newC))
            continue;
        bitmap[i][j] = newC;
        queue.push([i - 1, j    ]);
        queue.push([i + 1, j    ]);
        queue.push([i,     j - 1]);
        queue.push([i,     j + 1]);
    }
}

DFSIterativeFloodFill(1, 2, 0, 2);
console.log(bitmap);
BFSIterativeFloodFill(1, 2, 2, 3);
console.log(bitmap);