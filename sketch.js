const cols = 5;
const rows = 5;
const grid = new Array(cols);

const openSet = [];
const closedSet = [];
let start;
let end;

class Spot {
    constructor() {
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }
}

function setup() {
    createCanvas(400, 400);

    for (let col = 0; col < cols; col++) {
        grid[col] = new Array(rows);
    }

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row] = new Spot();
        }
    }

    start = grid[0][0];
    start = grid[cols - 1][rows - 1];

    openSet.push(start);

    console.log(grid);
}

function draw() {
    background(0);

  
}
