let cols = 20;
let rows = 20;
const grid = new Array(cols);

let framerate = 30;
let obstacleChance = 0.25;
let iterations = 0;

let openList;
let closedList;

let startCell, endCell;
let endCellX = cols - 1;
let endCellY = rows - 1;
let cellWidth, cellHeight;
let curCell;
let path;

function addEventListeners() {
    // Selectors
    const restartButton = document.querySelector("#restart-btn");
    const fpsSlider = document.querySelector("#fps-slider");
    const fpsValueDisplay = document.querySelector("#fps-value");
    const gridSizeSelect = document.querySelector("#grid-size-select");
    const obstaclesSelect = document.querySelector("#obstacles-select");
    const pauseButton = document.querySelector("#pause-btn");
    pauseButton.textContent = "Pause";

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
        endCellX = cols - 1;
        endCellY = rows - 1;
        handleRestartLoop();
    }

    function handleObstaclesChange(event) {
        const newObstacleChance = Number(event.target.value);
        obstacleChance = newObstacleChance;
        handleRestartLoop();
    }

    // Remove existing event listeners
    pauseButton.removeEventListener("click", handlePauseChange);
    restartButton.removeEventListener("click", handleRestartLoop);
    fpsSlider.removeEventListener("input", handleFpsChange);
    gridSizeSelect.removeEventListener("change", handleGridSizeChange);
    obstaclesSelect.removeEventListener("change", handleObstaclesChange);

    // Add Event Listeners
    restartButton.addEventListener("click", handleRestartLoop);
    fpsSlider.addEventListener("input", handleFpsChange);
    gridSizeSelect.addEventListener("change", handleGridSizeChange);
    obstaclesSelect.addEventListener("change", handleObstaclesChange);
    pauseButton.addEventListener("click", handlePauseChange);
}

function handlePauseChange() {
    const pauseButton = document.querySelector("#pause-btn");
    const status = pauseButton.textContent;

    if (status === "Pause") {
        noLoop();
        pauseButton.textContent = "Resume";
    } else {
        loop();
        pauseButton.textContent = "Pause";
    }
}

function updateIterations() {
    const iterationsCounter = document.querySelector("#iteration-counter");
    iterations++;
    iterationsCounter.textContent = iterations;
}

function heuristic(a, b) {
    // Manhatten heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function setup() {
    console.log("SETUP");
    addEventListeners();
    iterations = 0;

    const canvasSize = 20 * cols;

    const canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent("canvas-container");
    frameRate(framerate);

    closedList = [];
    openList = new PriorityQueue();

    cellWidth = width / cols;
    cellHeight = height / rows;

    // Create columns + rows and populate with cells
    for (let col = 0; col < cols; col++) {
        grid[col] = new Array(rows);

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
    startCell = grid[0][0];
    endCell = grid[endCellX][endCellY];
    startCell.wall = false;
    endCell.wall = false;

    openList.enqueue(startCell);

    console.log(grid);
}

function draw() {
    background(0);
    frameRate(framerate);

    if (!openList.isEmpty()) {
        curCell = openList.dequeue();

        updateIterations();

        if (curCell === endCell) {
            noLoop();
            console.log("Done");
        }

        closedList.push(curCell);

        for (const neighbor of curCell.neighbors) {
            if (closedList.includes(neighbor) || neighbor.wall) continue;

            const tempG = curCell.g + 1;

            if (!openList.includes(neighbor) || tempG < neighbor.g) {
                neighbor.g = tempG;
                neighbor.h = heuristic(neighbor, endCell);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = curCell;

                if (!openList.includes(neighbor)) {
                    openList.enqueue(neighbor);
                }
            }
        }
    } else {
        // No solution
        console.log("No solution");
        window.alert("No solution found 😥");
        noLoop();
    }

    colorCells();
}

function colorCells() {
    // Color every cell with base color
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            grid[col][row].show(color(255));
        }
    }

    // Color closed set cells
    closedList.forEach((cell) => cell.show(color(255, 0, 0)));

    // Color open set cells
    openList.cells.forEach((cell) => {
        cell.show(color(0, 255, 0));
    });

    // Create path for coloring
    path = [];
    let temp = curCell;

    do {
        path.push(temp);
        temp = temp.previous;
    } while (temp);

    // Color path cells
    path.forEach((cell) => cell.show(color(0, 0, 255)));

    // Color start cell
    startCell.show(color(255, 0, 255));

    // Color end cell
    endCell.show(color(255, 255, 0));
}

function mousePressed() {
    // Loop through all cells to check if the mouse is inside any cell
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            // Calculate coordinates for the top-left corner of each grid cell
            let x = col * cellWidth;
            let y = row * cellHeight;

            // Check if the mouse is inside the cell using a bounding box check
            if (mouseX > x && mouseX < x + cellWidth && mouseY > y && mouseY < y + cellHeight) {
                endCellX = col;
                endCellY = row;
                setup();
                loop();
                return; // Exit the loop once the cell is found
            }
        }
    }
}
