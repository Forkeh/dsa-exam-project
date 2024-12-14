const cols = 5;
const rows = 5;
const grid = new Array(cols);

const openSet = [];
const closedSet = [];
let start, end;
let w, h;

class Spot {
    x;
    y;
    f = 0;
    g = 0;
    h = 0;
    constructor(col, row) {
        this.x = col;
        this.y = row;
    }

    show() {
        fill(255);
        stroke(0);
        rect(this.x * w, this.y * h, w, h);
        console.log("SHOW");
        
    }
}

function setup() {
    createCanvas(400, 400);

    console.log("A*");

    w = width / cols;
    h = height / rows;

    for (let col = 0; col < cols; col++) {
        grid[col] = new Array(rows);
    }

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row] = new Spot(col, row);
        }
    }

    start = grid[0][0];
    start = grid[cols - 1][rows - 1];

    openSet.push(start);

    console.log(grid);
}

function draw() {
    background(0);

    if (openSet.length > 0) {
        // We can keep going
    } else {
        // No solution
    }

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row].show();
        }
    }
}
