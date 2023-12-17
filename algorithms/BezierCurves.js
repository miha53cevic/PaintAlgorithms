class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
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
    return [Bx, By];
}

const controlPoints = [
    new Point(0,0),
    new Point(5,5),
    new Point(2,-5),
    new Point(10,0),
];
const Bt = CubicBezierCurve(controlPoints, 0.5);
console.log(Bt);

// Provjera
// https://www.desmos.com/calculator/ebdtbxgbq0