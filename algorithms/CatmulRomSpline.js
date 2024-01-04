class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

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

const controlPoints = [
    new Point(0,0),
    new Point(5,5),
    new Point(2,-5),
    new Point(10,0),
];
const Ct = CatmulRomSpline(controlPoints, 0.5);
console.log(Ct);