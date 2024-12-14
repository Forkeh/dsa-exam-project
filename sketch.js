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

    show(color) {
        fill(color);
        noStroke();
        rect(this.x * w, this.y * h, w - 1, h - 1);
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
    end = grid[cols - 1][rows - 1];

    openSet.push(start);

    console.log(grid);
}

function draw() {
    background(0);

    if (openSet.length > 0) {
        let winner = 0;

        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        if ((openSet[winner] = end)) {
            console.log("Done");
        }
    } else {
        // No solution
    }

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row].show(color(255));
        }
    }

    for (let i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for (let i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }
}
