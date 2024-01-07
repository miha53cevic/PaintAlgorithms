createCanvas(640, 480, '2d');

class Point {
    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    /**
     * @param {Point} p topLeftCorner
     * @param {Number} w Width
     * @param {Number} h Height
     * @param {Boolean} selected isSelected
     */
    constructor(p, w, h, selected = false) {
        this.p = p;
        this.w = w;
        this.h = h;
        this.selected = selected;
    }
}

/**
 * @param {Point} p0 
 * @param {Point} p1 
 * @param {Point} p2 
 * @param {Point} p3 
 */
function LineSegmentsIntersection(p1, q1, p2, q2) {
    function Orientation(p, q, r) {
        const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0; // Collinear
        else return (val > 0) ? 1 : 2; // Clockwise or counterclockwise
    }

    function OnSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    const o1 = Orientation(p1, q1, p2)
    const o2 = Orientation(p1, q1, q2)
    const o3 = Orientation(p2, q2, p1)
    const o4 = Orientation(p2, q2, q1)

    if (o1 != o2 && o3 != o4) return true;
    if (o1 == 0 && OnSegment(p1, p2, q1)) return true;
    if (o2 == 0 && OnSegment(p1, q2, q1)) return true;
    if (o3 == 0 && OnSegment(p2, p1, q2)) return true;
    if (o4 == 0 && OnSegment(p2, q1, q2)) return true;

    return false;
}

/**
 * @param {Point} p0 
 * @param {Point} p1 
 * @param {Rect} rect 
 */
function LineSegmentRectIntersect(p0, p1, rect) {
    const topLeft = rect.p;
    const topRight = new Point(rect.p.x + rect.w, rect.p.y);
    const bottomLeft = new Point(rect.p.x, rect.p.y + rect.h);
    const bottomRight = new Point(rect.p.x + rect.w, rect.p.y + rect.h);
    const a1 = LineSegmentsIntersection(p0, p1, topLeft, topRight);
    const a2 = LineSegmentsIntersection(p0, p1, topLeft, bottomLeft);
    const a3 = LineSegmentsIntersection(p0, p1, bottomLeft, bottomRight);
    const a4 = LineSegmentsIntersection(p0, p1, topRight, bottomRight);
    return Math.max(a1, a2, a3, a4) === 1 ? true : false;
}

/**
 * @param {Array<Point>} path 
 * @param {Rect} rect 
 */
function RectIntersectsPath(path, rect) {
    let p0 = path[0];
    for (let i = 1; i <= path.length; i++) {
        const p1 = path[i % path.length];
        if (LineSegmentRectIntersect(p0, p1, rect)) return true;
        p0 = p1;
    }
    return false;
};

/**
 * @param {Array<Point>} path 
 * @param {Rect} rect 
 */
function RectInPolygon(path, rect) {
    let counter = 0;
    let p0 = path[0];
    const p = rect.p; // top left corner of rect
    // Za svaki linijski segment provjeri da li p presječe segment ako bacamo desni beskonačni ray od p
    for (let i = 1; i <= path.length; i++) {
        const p1 = path[i % path.length]; // od p0 i p1 stvaramo linijski segment
        if (p.y > Math.min(p0.y, p1.y)) {
            if (p.y <= Math.max(p0.y, p1.y)) {
                if (p.x <= Math.max(p0.x, p1.x)) {
                    if (p0.y !== p1.y) {
                        const xIntersect = ((p.y - p0.y) * (p1.x - p0.x)) / (p1.y - p0.y) + p0.x;
                        if (p0.x === p1.x || p.x <= xIntersect) counter++;
                    }
                }
            }
        }
        p0 = p1;
    }
    if (counter % 2 !== 0) return true;
    return RectIntersectsPath(path, rect);
};

let path = [];
let rects = [];
function Init() {

    let holding = false;
    ctx.canvas.addEventListener('mousedown', (e) => {
        if (e.which !== 1) return;
        holding = true;
        path = []; // reset path array
        // Deselect previous selected
        for (const rect of rects) {
            rect.selected = false;
        }
    });

    ctx.canvas.addEventListener('mouseup', (e) => {
        if (e.which !== 1) return;
        holding = false;

        if (path.length == 0) return; // if only left click is pressed and released withouth movement after

        // Add first point again so it's a closed loop
        path.push(path[0]);

        console.log("Path: ", path);

        // Run algorithm
        for (const rect of rects) {
            const selected = RectInPolygon(path, rect);
            rect.selected = selected;
        }
    });

    ctx.canvas.addEventListener('mousemove', () => {
        if (!holding) return;
        // Add points to path
        path.push(new Point(Math.floor(MOUSE_POS.x), Math.floor(MOUSE_POS.y)));
    });

    rects.push(new Rect(new Point(100, 100), 50, 50));
    rects.push(new Rect(new Point(150, 233), 75, 50));
    rects.push(new Rect(new Point(400, 330), 50, 120));
    rects.push(new Rect(new Point(400, 75), 200, 45));

    requestAnimationFrame(Loop);
}

function Loop() {
    clear('white');

    // Draw rects
    for (const rect of rects) {
        const colour = rect.selected ? 'yellow' : 'greenyellow';
        drawFillRect(rect.p.x, rect.p.y, rect.w, rect.h, colour)
    }

    // Draw path
    if (path.length > 0)
        lineStrip(path, 'black');

    requestAnimationFrame(Loop);
}

Init();