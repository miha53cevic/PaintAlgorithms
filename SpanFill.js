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

function Scan(lx, rx, i, stack, oldC, newC) {
    // nema smisla dodati sve točke spana, samo početak nam treba 
    // tak da ako smo našli spana ne dodaj tak dugo dok ne najdem prvi desni koji nije valid 
    // jer onda znam da je moj span završil i da samo sljedeći može početi
    let span_added = false; 
    for (let x = lx; x <= rx; x++) {
        if (!IsValid(i, x, oldC, newC)) {
            span_added = false;
        }
        else if (!span_added) {
            stack.push([i, x]);
            span_added = true;
        }
    }
}

function SpanFill(initial_i, initial_j, oldC, newC) {
    if (!IsValid(initial_i, initial_j, oldC, newC))
        return;
    const stack = [[initial_i, initial_j]];
    while (stack.length > 0) {
        const [i, j] = stack.pop();
        let lx = j;
        let rx = j + 1;
        while (IsValid(i, lx, oldC, newC)) {
            bitmap[i][lx] = newC;
            lx--;
        }
        while (IsValid(i, rx, oldC, newC)) {
            bitmap[i][rx] = newC;
            rx++;
        }
        Scan(lx + 1, rx - 1, i + 1, stack, oldC, newC); // lx i rx zadnji su oni koji su invalid
        Scan(lx + 1, rx - 1, i - 1, stack, oldC, newC);
    }
}

console.log("Original: ", bitmap);
SpanFill(1, 2, 0, 2);
console.log(bitmap);