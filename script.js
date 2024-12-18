let cols = 20;
let rows = 20;
const grid = new Array(cols);
let framerate = 30;
let obstacleChance = 0.25;

let openSet;
let closedSet;
let start, end;
let cellWidth, cellHeight;
let current;
let path;

function addEventListeners() {
    // Selectors
    const restartButton = document.querySelector("#restart-btn");
    const fpsSlider = document.querySelector("#fps-slider");
    const fpsValueDisplay = document.querySelector("#fps-value");
    const gridSizeSelect = document.querySelector("#grid-size-select");
    const obstaclesSelect = document.querySelector("#obstacles-select");

    // Event Handlers
    function handleRestartLoop() {
        setup();
        loop();
    }

    function handleFpsChange() {
        fpsValueDisplay.textContent = fpsSlider.value;
        framerate = Number(fpsSlider.value);
    }

    function handleGridSizeChange(event) {
        const newGridSize = Number(event.target.value);
        cols = newGridSize;
        rows = newGridSize;
        handleRestartLoop();
    }

    function handleObstaclesChange(event) {
        const newObstacleChance = Number(event.target.value);
        obstacleChance = newObstacleChance;
        handleRestartLoop();
    }

    // Add Event Listeners
    restartButton.addEventListener("click", handleRestartLoop);
    fpsSlider.addEventListener("input", handleFpsChange);
    gridSizeSelect.addEventListener("change", handleGridSizeChange);
    obstaclesSelect.addEventListener("change", handleObstaclesChange);
}

function heuristic(a, b) {
    // Manhatten heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function setup() {
    console.log("SETUP");
    addEventListeners();

    const canvasSize = 20 * cols;

    createCanvas(canvasSize, canvasSize);
    frameRate(framerate);

    closedSet = [];
    openSet = new PriorityQueue();

    cellWidth = width / cols;
    cellHeight = height / rows;

    // Create columns and rows
    for (let col = 0; col < cols; col++) {
        grid[col] = new Array(rows);
    }

    // Populate grid with cells
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row] = new Cell(col, row, obstacleChance);
        }
    }

    // Add neighbors for each cell
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

    openSet.enqueue(start);

    console.log(grid);
}

function draw() {
    background(0);
    frameRate(framerate);

    if (!openSet.isEmpty()) {
        current = openSet.dequeue();

        if (current === end) {
            noLoop();
            console.log("Done");
        }

        closedSet.push(current);

        for (const neighbor of current.neighbors) {
            if (closedSet.includes(neighbor) || neighbor.wall) continue;

            const tempG = current.g + 1;

            if (!openSet.includes(neighbor) || tempG < neighbor.g) {
                neighbor.g = tempG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;

                if (!openSet.includes(neighbor)) {
                    openSet.enqueue(neighbor);
                }
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
    openSet.cells.forEach((cell) => {
        cell.show(color(0, 255, 0));
    });

    // Create path for coloring
    path = [];
    let temp = current;

    do {
        path.push(temp);
        temp = temp.previous;
    } while (temp);

    // Color path cells
    path.forEach((cell) => cell.show(color(0, 0, 255)));

    // Color start cell
    start.show(color(255, 0, 255));

    // Color end cell
    end.show(color(255, 255, 0));
}
