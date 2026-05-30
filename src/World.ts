import type {Direction} from "./directions";
import type {TextElement} from "./TextElement";

export class World {
    private updateId: number | undefined = undefined;
    private _isRunning: boolean = false;
    private _elements: TextElement[] = [];

    private _width = 0;

    public constructor(
        private readonly _textDirection: Direction,
    ) {
    }

    get elements() {
        return this._elements;
    }

    public addElement(element: TextElement) {
        this._elements.push(element);
    }

    public resize(width: number) {
        this._width = width;
    }

    public start() {
        if (!this._isRunning) {
            this._isRunning = true;
            this.updateWorld();
        }
    }

    public stop() {
        this._isRunning = false;
        if (this.updateId !== undefined) {
            window.clearTimeout(this.updateId);
            this.updateId = undefined;
        }
    }

    private areObjectsColliding(a: TextElement, b: TextElement) {
        const hCollision = a.boundingBox.left > b.boundingBox.right || b.boundingBox.left > a.boundingBox.right;
        const vCollision = a.boundingBox.top > b.boundingBox.bottom || b.boundingBox.top > a.boundingBox.bottom;
        return !(hCollision || vCollision);
    }

    private getCollisionAxis(a: TextElement, b: TextElement): 'x' | 'y' {
        const xValues = [a.positionX, a.positionX + a.width, b.positionX, b.positionX + b.width];
        const yValues = [a.positionY, a.positionY + a.height, b.positionY, b.positionY + b.height];

        const sort = (numA: number, numB: number) => numA - numB;
        xValues.sort(sort);
        yValues.sort(sort);

        const overlappingX = xValues[2] - xValues[1];
        const overlappingY = yValues[2] - yValues[1];

        return overlappingX < overlappingY ? 'x' : 'y';
    }

    private handleCollision(a: TextElement, b: TextElement) {
        const axis = this.getCollisionAxis(a, b);

        if (axis === 'x') {
            this.handleXCollision(a, b);
        } else {
            this.handleYCollision(a, b);
        }
    }

    private handleXCollision(a: TextElement, b: TextElement) {
        if (this._textDirection.x === 0) return;

        const aIsLeftOfB = a.boundingBox.left < b.boundingBox.left;
        const left = aIsLeftOfB ? a : b;
        const right = aIsLeftOfB ? b : a;

        if (this._textDirection.x < 0) {
            left.boostUpByCollision(right);
            right.breakDownByCollision(left);
        } else {
            right.boostUpByCollision(left);
            left.breakDownByCollision(right);
        }
    }

    private handleYCollision(a: TextElement, b: TextElement) {
        if (this._textDirection.y === 0) return;

        const aIsAboveB = a.boundingBox.top < b.boundingBox.top;
        const top = aIsAboveB ? a : b;
        const bottom = aIsAboveB ? b : a;

        if (this._textDirection.y < 0) {
            top.boostUpByCollision(bottom);
            bottom.breakDownByCollision(top);
        } else {
            bottom.boostUpByCollision(top);
            top.breakDownByCollision(bottom);
        }
    }

    private detectCollisions() {
        for (let i = 0; i < this._elements.length; i++) {
            const a = this._elements[i];

            for (let j = i + 1; j < this._elements.length; j++) {
                const b = this._elements[j];

                if (!this.areObjectsColliding(a, b)) {
                    continue;
                }

                this.handleCollision(a, b);
            }
        }
    }

    private updateElements() {
        for (let i = this._elements.length - 1; i >= 0; i--) {
            const element = this._elements[i];
            element.move();

            if (element.isCollidingWithBorder(this._textDirection.x, this._width)) {
                this._elements.splice(i, 1);
            }
        }
    }

    private updateWorld() {
        if (!this._isRunning) return;

        this.detectCollisions();
        this.updateElements();

        this.updateId = window.setTimeout(() => this.updateWorld(), 1000 / 60);
    }
}
