class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

createCanvas(640, 480, '2d');

const LINE_SEGMENTS = 200;
const POINT_SIZE = 16;
let controlPoints = [];
let selectedControlPoint = null;

function CatmulRomSpline(P, t) {
    const tt = t * t;
    const ttt = tt * t;

    // https://lucidar.me/en/mathematics/catmull-rom-splines/
    const q0 = -ttt + 2.0*tt - t;
    const q1 = 3.0*ttt - 5.0*tt + 2.0;
    const q2 = -3.0*ttt + 4.0*tt + t;
    const q3 = ttt - tt;

    const Cx = 0.5 * (P[0].x*q0 + P[1].x*q1 + P[2].x*q2 + P[3].x*q3);
    const Cy = 0.5 * (P[0].y*q0 + P[1].y*q1 + P[2].y*q2 + P[3].y*q3);
    return new Point(Cx, Cy);
}

function Init() {
    controlPoints = [
        new Point(100, 200),
        new Point(200, 200),
        new Point(300, 200),
        new Point(400, 200),
        new Point(500, 200),
        new Point(600, 200),
    ];

    ctx.canvas.addEventListener('mousedown', (ev) => {
        if (ev.which !== 1) return;

        for (const cp of controlPoints) {
            const left = cp.x - POINT_SIZE / 2;
            const right = cp.x + POINT_SIZE / 2;
            const top = cp.y - POINT_SIZE / 2;
            const bottom = cp.y + POINT_SIZE / 2;

            if (MOUSE_POS.x >= left &&
                MOUSE_POS.x <= right &&
                MOUSE_POS.y >= top &&
                MOUSE_POS.y <= bottom
            ) {
                selectedControlPoint = cp;
                return;
            }
        }
        selectedControlPoint = null;
    });

    ctx.canvas.addEventListener('mousemove', (ev) => {
        if (!selectedControlPoint) return;

        selectedControlPoint.x = MOUSE_POS.x;
        selectedControlPoint.y = MOUSE_POS.y;
    });

    ctx.canvas.addEventListener('mouseup', (ev) => {
        if (ev.which !== 1) return;
        selectedControlPoint = null;
    });

    requestAnimationFrame(Loop);
}

function Loop() {
    clear('white');

    let numberOfConnectedSplines = (controlPoints.length - 2); // makni rubne kontrolne točke
    numberOfConnectedSplines -= 1; // za 2 imamo 1, za 3 imamo 2, za 4 imamo 3 spline-a... (odnosno length(controlPoints)-3)
    for (let j = 0; j < numberOfConnectedSplines; j++) {
        const curvePoints = [];
        const controlSubset = [
            controlPoints[0+j],
            controlPoints[1+j],
            controlPoints[2+j],
            controlPoints[3+j],
        ];
        for (let i = 0; i <= LINE_SEGMENTS; i++) {
            const t = i / LINE_SEGMENTS;
            const Ct = CatmulRomSpline(controlSubset, t);
            curvePoints.push(Ct);
        }
        lineStrip(curvePoints, 'black', 4);
    }

    let i = 0;
    for (const cp of controlPoints) {
        const x = cp.x - POINT_SIZE / 2;
        const y = cp.y - POINT_SIZE / 2;
        drawFillRect(x, y, POINT_SIZE, POINT_SIZE, 'red');
        drawStrokeText(`P${i}`, x, y, 24);
        i++;
    }

    if (selectedControlPoint) {
        drawFillRect(selectedControlPoint.x - POINT_SIZE / 2, selectedControlPoint.y - POINT_SIZE / 2, POINT_SIZE, POINT_SIZE, 'blue');
    }

    requestAnimationFrame(Loop);
}

Init();