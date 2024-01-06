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
     */
    constructor(p, w, h) {
        this.p = p;
        this.w = w;
        this.h = h;
    }
}

function LineSegmentsIntersection(p0, p1, p2, p3) {
    
}

function LineSegmentRectIntersect(p0, p1, rect) {

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
    return RectIntersectsPath(path, rectangle);
};

function Init() {
}

Init();