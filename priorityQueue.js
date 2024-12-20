class PriorityQueue {
    constructor() {
        this.cells = [];
    }

    enqueue(cell) {
        const hasCell = this.cells.includes(cell);

        if (!hasCell) {
            this.cells.push(cell);
        }

        this.cells.sort((a, b) => {
             if (a.f < b.f) return -1;
             if (a.f > b.f) return 1;

             if (a.h < b.h) return -1;
             if (a.h > b.h) return 1;

             if (a.g > b.g) return -1;
             if (a.g < b.g) return 1;
            return 0;
        });

        console.log(
            "Queue:",
            this.cells.map((c) => ({ g: c.g, f: c.f, x: c.x, y: c.y }))
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
