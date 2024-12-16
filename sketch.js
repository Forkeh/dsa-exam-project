const cols = 25;
const rows = 25;
const grid = new Array(cols);

let openSet = [];
const closedSet = [];
let start, end;
let w, h;
let current;
let path = [];

function heuristic(a, b) {
    // Manhatten heuristic
    return abs(a.x - b.x) + abs(a.y - b.y);
}

class Spot {
    x;
    y;
    f = 0;
    g = 0;
    h = 0;
    neighbors = [];
    previous = null;
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

    addNeighbors(grid) {
        if (this.x + 1 < cols) this.neighbors.push(grid[this.x + 1][this.y]);

        if (this.x - 1 >= 0) this.neighbors.push(grid[this.x - 1][this.y]);

        if (this.y + 1 < rows) this.neighbors.push(grid[this.x][this.y + 1]);

        if (this.y - 1 >= 0) this.neighbors.push(grid[this.x][this.y - 1]);
    }
}

function setup() {
    createCanvas(400, 400);

    console.log("A*");

    w = width / cols;
    h = height / rows;

    // Create columns and rows
    for (let col = 0; col < cols; col++) {
        grid[col] = new Array(rows);
    }

    // Populate each cell with spot
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row] = new Spot(col, row);
        }
    }

    // Add neighbors for each spot
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row].addNeighbors(grid);
        }
    }

    // Set start and end cells
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
        current = openSet[winner];

        if (current === end) {
            noLoop();
            console.log("Done");
        }

        // TODO: Does this work?
        openSet = openSet.filter((spot) => spot !== current);

        closedSet.push(current);

        const neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                const tempG = current.g + 1;

                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }
    } else {
        // No solution
    }

    // Color every cell
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

    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}
