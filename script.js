let cols = 20;
let rows = 20;
const grid = new Array(cols);

let framerate = 30;
let obstacleChance = 0.25;
let iterations = 0;

let openList;
let closedList;

let startCell, goalCell;
let goalCellX = cols - 1;
let goalCellY = rows - 1;
let cellWidth, cellHeight;
let curCell;
let path;

let restartButton, fpsSlider, fpsValueDisplay, gridSizeSelect, obstaclesSelect, pauseButton;

// Init
document.addEventListener("DOMContentLoaded", () => {
    // Selectors
    restartButton = document.querySelector("#restart-btn");
    fpsSlider = document.querySelector("#fps-slider");
    fpsValueDisplay = document.querySelector("#fps-value");
    gridSizeSelect = document.querySelector("#grid-size-select");
    obstaclesSelect = document.querySelector("#obstacles-select");
    pauseButton = document.querySelector("#pause-btn");

    // Reset input/slider values (needed when refreshing page)
    pauseButton.textContent = "Pause";
    fpsSlider.value = "30";
    gridSizeSelect.value = "20";
    obstaclesSelect.value = "0.25";

    addEventListeners();
});

function addEventListeners() {
    restartButton.addEventListener("click", handleRestartLoop);
    fpsSlider.addEventListener("input", handleFpsChange);
    gridSizeSelect.addEventListener("change", handleGridSizeChange);
    obstaclesSelect.addEventListener("change", handleObstaclesChange);
    pauseButton.addEventListener("click", handlePauseChange);
}

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
    goalCellX = cols - 1;
    goalCellY = rows - 1;
    handleRestartLoop();
}

function handleObstaclesChange(event) {
    const newObstacleChance = Number(event.target.value);
    obstacleChance = newObstacleChance;
    handleRestartLoop();
}

function handlePauseChange() {
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

function updateCurrentCellInfo(cell) {
    const currentCell = document.querySelector("#current-cell-values");
    const html = /*html*/ `
        <div><span>F: </span>${cell.f}</div>
        <div><span>H: </span>${cell.h}</div>
        <div><span>G: </span>${cell.g}</div>
    `;

    currentCell.innerHTML = html;
}

function heuristic(cellA, cellB) {
    // Manhatten heuristic
    return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y);
}

function setup() {
    console.log("SETUP");
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

    // Set start and goal cells
    startCell = grid[0][0];
    goalCell = grid[goalCellX][goalCellY];
    startCell.wall = false;
    goalCell.wall = false;

    openList.enqueue(startCell);

    console.log(grid);
}

function draw() {
    background(50);
    frameRate(framerate);

    if (openList.isEmpty()) {
        // No solution
        console.log("No solution");
        window.alert("No solution found 😥");
        noLoop();
    } else {
        curCell = openList.dequeue();
        closedList.push(curCell);
    }

    updateIterations();
    updateCurrentCellInfo(curCell);

    if (curCell === goalCell) {
        console.log("Found solution");
        noLoop();
        colorCells();
        return;
    }

    for (const neighbor of curCell.neighbors) {
        if (closedList.includes(neighbor) || neighbor.wall) continue;

        const tempG = curCell.g + 1;

        if (!neighbor.g || tempG < neighbor.g) {
            neighbor.g = tempG;
            neighbor.h = heuristic(neighbor, goalCell);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = curCell;

            openList.enqueue(neighbor);
        }
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

    // Color closed list cells
    closedList.forEach((cell) => cell.show(color(255, 50, 50)));

    // Color open list cells
    openList.cells.forEach((cell) => {
        cell.show(color(60, 255, 50));
    });

    // Create path for coloring
    path = [];
    let temp = curCell;

    do {
        path.push(temp);
        temp = temp.previous;
    } while (temp);

    // Color path cells
    path.forEach((cell) => cell.show(color(50, 65, 255)));

    // Color start cell
    startCell.show(color(255, 0, 255));

    // Color goal cell
    goalCell.show(color(255, 220, 50));
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
                goalCellX = col;
                goalCellY = row;
                setup();
                loop();
                return; // Exit the loop once the cell is found
            }
        }
    }
}
