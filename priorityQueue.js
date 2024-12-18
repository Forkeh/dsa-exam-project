class PriorityQueue {
    constructor() {
        this.cells = [];
    }

    enqueue(cell) {
        const existingIndex = this.cells.findIndex((c) => c === cell);

        if (existingIndex > -1) {
            if (cell.f < this.cells[existingIndex].f) {
                this.cells[existingIndex] = cell;
            }
        } else {
            this.cells.push(cell);
        }

        this.cells.sort((a, b) => a.f - b.f);

        console.log(
            "Queue:",
            this.cells.map((c) => ({ x: c.x, y: c.y, f: c.f }))
        );
    }

    dequeue() {
        return this.cells.shift();
    }

    isEmpty() {
        return this.cells.length === 0;
    }

    includes(cell) {
        return this.cells.some((c) => c === cell);
    }
}
