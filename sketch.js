const cols = 25;
const rows = 25;
const grid = new Array(cols);
let framerate = 30;

let openSet;
let closedSet;
let start, end;
let cellWidth, cellHeight;
let current;
let path;

function heuristic(a, b) {
    // Manhatten heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function removeFromOpenSet() {
    const index = openSet.indexOf(current);
    if (index > -1) {
        openSet.splice(index, 1);
    }
}

class Spot {
    x;
    y;
    f = 0;
    g = 0;
    h = 0;
    neighbors = [];
    previous = null;
    wall = false;
    constructor(col, row) {
        this.x = col;
        this.y = row;
        this.wall = Math.random(1) < 0.3;
    }

    show(color) {
        if (this.wall) {
            fill(0);
        } else {
            fill(color);
        }
        noStroke();
        rect(this.x * cellWidth, this.y * cellHeight, cellWidth - 1, cellHeight - 1);

        // Only shows h-score on cells in openSet
        if (openSet.includes(this)) {
            fill(0);
            textAlign(CENTER, CENTER); // Center the text
            text(this.h, this.x * cellWidth + cellWidth / 2, this.y * cellHeight + cellHeight / 2);
        }
    }

    addNeighbors(grid) {
        if (this.x + 1 < cols) this.neighbors.push(grid[this.x + 1][this.y]);

        if (this.x - 1 >= 0) this.neighbors.push(grid[this.x - 1][this.y]);

        if (this.y + 1 < rows) this.neighbors.push(grid[this.x][this.y + 1]);

        if (this.y - 1 >= 0) this.neighbors.push(grid[this.x][this.y - 1]);
    }
}

function setup() {
    console.log("SETUP");
    addEventListeners();

    createCanvas(500, 500);
    frameRate(framerate);

    closedSet = [];
    openSet = [];
    path = [];

    cellWidth = width / cols;
    cellHeight = height / rows;

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
    start.wall = false;
    end.wall = false;

    openSet.push(start);

    console.log(grid);
}

function draw() {
    background(0);
    frameRate(framerate);

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

        removeFromOpenSet();

        closedSet.push(current);

        const neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i];

            if (!closedSet.includes(neighbor) && !neighbor.wall) {
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
        console.log("No solution");
        window.alert("No solution found 😥");
        noLoop();
    }

    // Color every cell
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row].show(color(255));
        }
    }

    // Color closed set cells
    closedSet.forEach((cell) => cell.show(color(255, 0, 0)));

    // Color open set cells
    openSet.forEach((cell) => {
        cell.show(color(0, 255, 0));
    });

    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    // Color path cells
    path.forEach((cell) => cell.show(color(0, 0, 255)));

    // Color start cell
    start.show(color(255, 0, 255));

    // Color end cell
    end.show(color(255, 255, 0));

    // if (mouseIsPressed) {
    //     console.log("CLICK");
    //     // noLoop();
    // }
}

function addEventListeners() {
    document.querySelector("#restart-btn").addEventListener("click", () => {
        console.log("RESTART");
        setup();
        loop();
    });

    const fpsSlider = document.querySelector("#fps-slider");
    const fpsValueDisplay = document.querySelector("#fps-value");
    fpsSlider.addEventListener("input", () => {
        fpsValueDisplay.textContent = fpsSlider.value;
        framerate = Number(fpsSlider.value);
        console.log("framerate: ", framerate);
    });
}
