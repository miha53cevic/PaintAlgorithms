class Pixel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = '#FFFFFF';
    }
}

createCanvas(640, 480, '2d');

const bitmap = [];
const PIXEL_SIZE = 32;
const w = Math.floor(WIDTH / PIXEL_SIZE);
const h = Math.floor(HEIGHT / PIXEL_SIZE);
const startingPos = { i: Math.floor(h / 2), j: Math.floor(w / 2) };

function RenderPixels() {
    clear('black');
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const pixel = bitmap[i][j];
            drawFillRect(pixel.x, pixel.y, PIXEL_SIZE - 1, PIXEL_SIZE - 1, pixel.color);
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function NeighbourExists(i, j) {
    if (i < 0 || i >= h || j < 0 || j >= w)
        return false;
    return true;
}

function IsValid(i, j, oldC, newC) {
    if (!NeighbourExists(i, j))
        return false;
    const color = bitmap[i][j].color;
    if (color != oldC || color == newC)
        return false;
    return true;
}

async function DFSIterativeFloodFill(initial_i, initial_j, oldC, newC) {
    const stack = [];
    stack.push([initial_i, initial_j]);
    while (stack.length > 0) {
        const [i, j] = stack.pop();
        if (!IsValid(i, j, oldC, newC))
            continue;
        bitmap[i][j].color = newC;
        RenderPixels();
        await sleep(16.6);
        stack.push([i - 1, j]);
        stack.push([i + 1, j]);
        stack.push([i, j - 1]);
        stack.push([i, j + 1]);
    }
    Controls(true);
}

async function BFSIterativeFloodFill(initial_i, initial_j, oldC, newC) {
    const queue = [];
    queue.push([initial_i, initial_j]);
    while (queue.length > 0) {
        const [i, j] = queue.shift();
        if (!IsValid(i, j, oldC, newC))
            continue;
        bitmap[i][j].color = newC;
        RenderPixels();
        await sleep(16.6);
        queue.push([i - 1, j]);
        queue.push([i + 1, j]);
        queue.push([i, j - 1]);
        queue.push([i, j + 1]);
    }
    Controls(true);
}

function Scan(lx, rx, i, stack, oldC, newC) {
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

async function SpanFill(initial_i, initial_j, oldC, newC) {
    if (!IsValid(initial_i, initial_j, oldC, newC))
        return;
    const stack = [[initial_i, initial_j]];
    while (stack.length > 0) {
        const [i, j] = stack.pop();
        let lx = j;
        let rx = j + 1;
        while (IsValid(i, lx, oldC, newC)) {
            bitmap[i][lx].color = newC;
            lx--;
            RenderPixels();
            await sleep(16.6);
        }
        while (IsValid(i, rx, oldC, newC)) {
            bitmap[i][rx].color = newC;
            rx++;
            RenderPixels();
            await sleep(16.6);
        }
        Scan(lx + 1, rx - 1, i + 1, stack, oldC, newC); 
        Scan(lx + 1, rx - 1, i - 1, stack, oldC, newC);
    }
    Controls(true);
}

const selectedAlgorithm = document.getElementById('selectedAlgorithm');
const resetBtn = document.getElementById('resetBtn');
const fillColorPicker = document.getElementById('fillColorPicker');
const colorPicker = document.getElementById('colorPicker');

function Controls(enabled) {
    resetBtn.disabled = !enabled;
    selectedAlgorithm.disabled = !enabled;
}

function Reset() {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            bitmap[i][j].color = '#FFFFFF';
        }
    }
    RenderPixels();
}

function InitUI() {
    resetBtn.addEventListener('click', () => {
        Reset();
    });

    ctx.canvas.addEventListener('mousedown', (ev) => {
        const x = Math.floor(MOUSE_POS.x / PIXEL_SIZE);
        const y = Math.floor(MOUSE_POS.y / PIXEL_SIZE);
        if (ev.which === 1) {
            startingPos.i = y;
            startingPos.j = x;
            const startingPosColor = bitmap[startingPos.i][startingPos.j].color;
            switch (selectedAlgorithm.value) {
                case 'dfs':
                    DFSIterativeFloodFill(startingPos.i, startingPos.j, startingPosColor, fillColorPicker.value);
                    break;
                case 'bfs':
                    BFSIterativeFloodFill(startingPos.i, startingPos.j, startingPosColor, fillColorPicker.value);
                    break;
                case 'spanFill':
                    SpanFill(startingPos.i, startingPos.j, startingPosColor, fillColorPicker.value);
                    break;
            }
            Controls(false);
        } else if (ev.which === 3) {
            bitmap[y][x].color = colorPicker.value;
            RenderPixels();
        }
    });
    ctx.canvas.addEventListener('contextmenu', (ev) => {
        // Disable default contextmenu on mouse right click
        ev.preventDefault();
    });
}

function Init() {
    InitUI();

    for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
            row.push(new Pixel(j * PIXEL_SIZE, i * PIXEL_SIZE));
        }
        bitmap.push(row);
    }

    RenderPixels();
}

Init();