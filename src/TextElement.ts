import type { BoundingBox, Settings } from "./types";
import type { Direction } from "./Direction";

export class TextElement {
    private _accelerateId: number | undefined = undefined;
    private _breakDownId: number | undefined = undefined;

    private _accelerationX = 0;
    private _accelerationY = 0;

    private _velocityX = 0;
    private _velocityY = 0;

    private readonly _acceleration: number = 0;
    private _boundingBox: BoundingBox;

    private readonly _font: string;
    private readonly _color: string;

    private readonly _maxAcceleration: number;

    public constructor(
        private _positionX: number,
        private _positionY: number,
        maxAcceleration: number,
        private readonly _width: number,
        private readonly _height: number,
        private readonly _text: string,
        private readonly _fontSize: number,
        private readonly _textDirection: Direction,
        _settings: Settings,
    ) {
        this._maxAcceleration = maxAcceleration;
        this._acceleration = 1 / this._fontSize;
        this._boundingBox = this.calculateBoundingBox();

        this._font = `${_fontSize}pt ${_settings.font}`;
        this._color = _settings.color;
    }

    get width(): number { return this._width; }
    get height(): number { return this._height; }

    get positionX(): number { return this._positionX; }
    set positionX(value: number) { this._positionX = value; }

    get positionY(): number { return this._positionY; }
    set positionY(value: number) { this._positionY = value; }

    get boundingBox(): BoundingBox { return this._boundingBox; }
    set boundingBox(value: BoundingBox) { this._boundingBox = value; }

    get accelerationX(): number { return this._accelerationX; }
    get accelerationY(): number { return this._accelerationY; } // Neu

    get fontSize(): number { return this._fontSize; }
    get font(): string { return this._font; }
    get color(): string { return this._color; }
    get text(): string { return this._text; }

    public isCollidingWithBorderX(direction: number, width: number) {
        if (direction < 0) {
            if (this._boundingBox.right < 0) return true;
        } else {
            if (this._boundingBox.left > width) return true;
        }
        return false;
    }

    public isCollidingWithBorderY(direction: number, height: number) {
        if (direction < 0) {
            if (this._boundingBox.bottom < 0) return true;
        } else {
            if (this._boundingBox.top > height) return true;
        }
        return false;
    }

    private calculateBoundingBox(): BoundingBox {
        return {
            top: this._positionY - this._height,
            right: this._positionX + this._width,
            bottom: this._positionY,
            left: this._positionX,
        };
    }

    private accelerate() {
        this._accelerationX += this._acceleration * this._textDirection.x;
        this._accelerationY += this._acceleration * this._textDirection.y;

        const currentMag = Math.sqrt(this._accelerationX ** 2 + this._accelerationY ** 2);

        if (currentMag < this._maxAcceleration) {
            this._accelerateId = window.setTimeout(() => this.accelerate(), 40);
        } else {
            this._accelerationX = this._maxAcceleration * this._textDirection.x;
            this._accelerationY = this._maxAcceleration * this._textDirection.y;
            this._accelerateId = undefined;
        }
    }

    private breakDown() {
        this._accelerationX += 0.1 * this._textDirection.x;
        this._accelerationY += 0.1 * this._textDirection.y;

        const currentMag = Math.sqrt(this._accelerationX ** 2 + this._accelerationY ** 2);

        if (currentMag > this._maxAcceleration) {
            this._breakDownId = window.setTimeout(() => this.breakDown(), 40);
        } else {
            this._accelerationX = this._maxAcceleration * this._textDirection.x;
            this._accelerationY = this._maxAcceleration * this._textDirection.y;
            this._breakDownId = undefined;
            this._accelerateId = undefined;
        }
    }

    public boostUpByCollision = (textElement: TextElement) => {
        if (this._textDirection.x !== 0) {
            this._accelerationX += (textElement.accelerationX - this._accelerationX) * (textElement.fontSize / this._fontSize);
        }
        if (this._textDirection.y !== 0) {
            this._accelerationY += (textElement.accelerationY - this._accelerationY) * (textElement.fontSize / this._fontSize);
        }

        clearTimeout(this._accelerateId);
        clearTimeout(this._breakDownId);

        this.breakDown();
    }

    public breakDownByCollision = (textElement: TextElement) => {
        if (this._textDirection.x !== 0) {
            this._accelerationX -= this._accelerationX * (textElement.fontSize / this._fontSize);
        }
        if (this._textDirection.y !== 0) {
            this._accelerationY -= this._accelerationY * (textElement.fontSize / this._fontSize);
        }

        clearTimeout(this._accelerateId);
        clearTimeout(this._breakDownId);

        this.accelerate();
    }

    public start() {
        this.accelerate();
    }

    public move() {
        this._velocityX = this._accelerationX;
        this._velocityY = this._accelerationY;

        this._positionX += this._velocityX;
        this._positionY += this._velocityY;

        this._boundingBox = this.calculateBoundingBox();
    }
}
