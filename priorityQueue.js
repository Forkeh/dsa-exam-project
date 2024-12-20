class PriorityQueue {
    constructor() {
        this.cells = [];
    }

    enqueue(cell) {
        const hasCell = this.cells.includes(cell);

        if (!hasCell) {
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
