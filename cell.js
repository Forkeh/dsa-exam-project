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
        rect(this.x * cellWidth, this.y * cellHeight, cellWidth - 1, cellHeight - 1);

        // Only shows h-score on cells in openSet
        if (openList.cells.includes(this)) {
            fill(0);
            textAlign(CENTER, CENTER);
            text(this.f, this.x * cellWidth + cellWidth / 2, this.y * cellHeight + cellHeight / 2);
        }
    }

    addNeighbors(grid) {
        if (this.x + 1 < cols) this.neighbors.push(grid[this.x + 1][this.y]);

        if (this.x - 1 >= 0) this.neighbors.push(grid[this.x - 1][this.y]);

        if (this.y + 1 < rows) this.neighbors.push(grid[this.x][this.y + 1]);

        if (this.y - 1 >= 0) this.neighbors.push(grid[this.x][this.y - 1]);
    }
}
