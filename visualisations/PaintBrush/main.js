createCanvas(640, 480, '2d');

const image = ctx.createImageData(WIDTH, HEIGHT);

const brushRadius = document.getElementById('brushRadius');
const brushColor = document.getElementById('brushColor');
const pixelSize = document.getElementById('pixelSize');

let w = Math.floor(WIDTH / pixelSize.value);
let h = Math.floor(HEIGHT / pixelSize.value);

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function NeighbourExists(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h)
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

// i,j are pixel size in local space
function PaintBrush(i, j, color, radius) {
    // Square of size radius around (i,j) center
    for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
            const neighbourX = j + x // in local space [0, w]
            const neighbourY = i + y; // in local space [0, h]
            if (!NeighbourExists(neighbourX, neighbourY)) continue;

            const distance = EuclidianDistance(j, i, neighbourX, neighbourY);
            if (distance >= radius) continue;

            // Color intensity falls off as we get further away
            const intensity = 1 - (distance / radius); // [0, 1] where 0 is distance = radius and 1 for distance = 0

            // For each pixel (it can be made of multiple actual pixels)
            for (let sy = 0; sy < pixelSize.value; sy++) {
                for (let sx = 0; sx < pixelSize.value; sx++) {
                    const offset = (WIDTH * (neighbourY * pixelSize.value + sy) + (neighbourX * pixelSize.value + sx)) * 4; // global space [0, WIDTH*HEIGHT]
                    image.data[offset + 0] = color.r;
                    image.data[offset + 1] = color.g;
                    image.data[offset + 2] = color.b;
                    image.data[offset + 3] = 255;
                }
            }
        }
    }
}

function InitUI() {
    pixelSize.addEventListener('change', () => {
        // clear screen
        for (let i = 0; i < image.data.length; i++) {
            image.data[i] = 255;
        }
        DrawImage();
        w = Math.floor(WIDTH / pixelSize.value);
        h = Math.floor(HEIGHT / pixelSize.value);
    });

    function Draw() {
        // Koristi paint brush algoritam
        const sx = Math.floor(MOUSE_POS.x / pixelSize.value);
        const sy = Math.floor(MOUSE_POS.y / pixelSize.value);
        PaintBrush(sy, sx, hexToRgb(brushColor.value), brushRadius.value);
        DrawImage();
    }

    let holding = false;
    ctx.canvas.addEventListener('mousedown', () => {
        holding = true;
        Draw();
    });

    ctx.canvas.addEventListener('mousemove', () => {
        if (!holding) return;
        Draw();
    });

    document.addEventListener('mouseup', () => {
        holding = false;
    })
}

function DrawImage() {
    ctx.putImageData(image, 0, 0);
}

function Init() {
    InitUI();
}

Init();