const TOP = 0;
const parent = (i: number) => ((i + 1) >>> 1) - 1;
const left = (i: number) => (i << 1) + 1;
const right = (i: number) => (i + 1) << 1;

export class PriorityQueue<T> {
    _heap: T[];
    _comparator: { (a: T, b: T): boolean };

    find: {(predicate: {(value: T, index: number, obj: T[]): boolean}): T | undefined };

    constructor(comparator = (a: T, b: T) => a > b) {
        this._heap = [];
        this._comparator = comparator;
        
        this.find = this._heap.find
    }
    
    size() {
        return this._heap.length;
    }
    
    isEmpty() {
        return this.size() == 0;
    }
    
    peek() {
        return this._heap[TOP];
    }
    
    push(...values: T[]) {
        values.forEach((value) => {
            this._heap.push(value);
            this._siftUp();
        });
        return this.size();
    }
    
    pop(): T {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > TOP) {
            this._swap(TOP, bottom);
        }
        this._heap.pop();
        this._siftDown();
        return poppedValue;
    }
    
    replace(value : T) {
        const replacedValue = this.peek();
        this._heap[TOP] = value;
        this._siftDown();
        return replacedValue;
    }

    
    _greater(i: number, j: number): boolean {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    
    _swap(i: number, j: number) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    _siftUp() {
        let node = this.size() - 1;
        while (node > TOP && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }

    _siftDown() {
        let node = TOP;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild =
                right(node) < this.size() && this._greater(right(node), left(node)) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
