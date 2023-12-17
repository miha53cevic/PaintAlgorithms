const bitmap = [[0,0,0],[1,1,0],[0,0,0]];
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

function DFSFloodFill(i, j, oldC, newC) {
    if (!IsValid(i, j, oldC, newC))
        return;
    bitmap[i][j] = newC;
    DFSFloodFill(i-1, j,   oldC, newC);
    DFSFloodFill(i+1, j,   oldC, newC);
    DFSFloodFill(i,   j-1, oldC, newC);
    DFSFloodFill(i,   j+1, oldC, newC);
}

DFSFloodFill(1, 2, 0, 2);
console.log(bitmap);