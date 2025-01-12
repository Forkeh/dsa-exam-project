class Cell {
    x;
    y;
    f = 0;
    g = 0;
    h = 0;
    neighbors = [];
    previous = null;
    wall = false;
    constructor(col, row, obstacleChance) {
        this.x = col;
        this.y = row;
        this.wall = Math.random(1) < obstacleChance;
    }

    show(color) {
        if (this.wall) {
            fill(50);
        } else {
            fill(color);
        }

        noStroke();
        const cellXCoord = this.x * cellWidth;
        const cellYCoord = this.y * cellHeight;
        const cellW = cellWidth - 1;
        const cellH = cellWidth - 1;
        rect(cellXCoord, cellYCoord, cellW, cellH);

        // Only shows h-cost on cells in openSet
        if (openList.cells.includes(this)) {

            // Calculate the center coordinates of the cell
            const centerX = cellXCoord + cellWidth / 2;
            const centerY = cellYCoord + cellHeight / 2;
            
            // Create text
            fill(0);
            text(this.f, centerX, centerY);
            textAlign(CENTER, CENTER);
        }
    }

    addNeighbors(grid) {
        // Check right
        if (this.x + 1 < cols) this.neighbors.push(grid[this.x + 1][this.y]);

        // Check left
        if (this.x - 1 >= 0) this.neighbors.push(grid[this.x - 1][this.y]);

        // Check down
        if (this.y + 1 < rows) this.neighbors.push(grid[this.x][this.y + 1]);

        // Check up
        if (this.y - 1 >= 0) this.neighbors.push(grid[this.x][this.y - 1]);
    }
}
