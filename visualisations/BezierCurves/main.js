class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

createCanvas(640, 480, '2d');

const LINE_SEGMENTS = 50;
const POINT_SIZE = 16;
let controlPoints = [];
let selectedControlPoint = null;
let selectedBezierOrderFunction = CubicBezierCurve;

function LinearBezier(P, t) {
    const oneMinusT = 1 - t;

    const Bx = oneMinusT * P[0].x + t * P[1].x;
    const By = oneMinusT * P[0].y + t * P[1].y;
    return new Point(Bx, By);
}

function QuadraticBezier(P, t) {
    const oneMinusT = 1 - t;
    const oneMinusTQuad = oneMinusT * oneMinusT;
    const t2 = t * t;

    const Bx = oneMinusTQuad * P[0].x + 2 * t * oneMinusT * P[1].x + t2 * P[2].x;
    const By = oneMinusTQuad * P[0].y + 2 * t * oneMinusT * P[1].y + t2 * P[2].y;
    return new Point(Bx, By);
}

function CubicBezierCurve(P, t) {
    const oneMinusT = 1 - t;
    const oneMinusTQuad = oneMinusT * oneMinusT;
    const oneMinusTCub = oneMinusTQuad * oneMinusT;
    const t2 = t * t;
    const t3 = t2 * t;

    const Bx = oneMinusTCub*P[0].x + 
               3*t*oneMinusTQuad*P[1].x + 
               3*t2*oneMinusT*P[2].x + 
               t3*P[3].x;
    const By = oneMinusTCub*P[0].y + 
               3*t*oneMinusTQuad*P[1].y + 
               3*t2*oneMinusT*P[2].y + 
               t3*P[3].y;
    return new Point(Bx, By);
}

const selectedBezierOrder = document.getElementById('selectBezierOrder');

function InitUI() {
    selectedBezierOrder.addEventListener('change', () => {
        switch (selectedBezierOrder.value) {
            case 'linear':
                selectedBezierOrderFunction = LinearBezier;
                controlPoints = [
                    new Point(100, 100),
                    new Point(400, 300),
                ];
                break;
            case 'quadratic':
                selectedBezierOrderFunction = QuadraticBezier;
                controlPoints = [
                    new Point(100, 100),
                    new Point(150, 200),
                    new Point(400, 300),
                ];
                break;
            case 'cubic':
                selectedBezierOrderFunction = CubicBezierCurve;
                controlPoints = [
                    new Point(100, 100),
                    new Point(150, 200),
                    new Point(250, 50),
                    new Point(400, 300),
                ];
                break;
        }
    });
}

function Init() {
    InitUI();

    controlPoints = [
        new Point(100, 100),
        new Point(150, 200),
        new Point(250, 50),
        new Point(400, 300),
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

    const curvePoints = [];
    for (let i = 0; i <= LINE_SEGMENTS; i++) {
        const t = i / LINE_SEGMENTS;
        const Bn = selectedBezierOrderFunction(controlPoints, t);
        curvePoints.push(Bn);
    }
    lineStrip(curvePoints, 'black', 4);

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