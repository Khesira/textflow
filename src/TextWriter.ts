import type {Settings} from "./types";
import type {World} from "./World";
import {TextElement} from "./TextElement";
import type {TextFlowView} from "./TextFlowView";
import type {Direction} from "./Direction";

export class TextWriter {
    private _textId: number | undefined = undefined;
    private _isRunning: boolean = false;

    private _minFontSize = 16;
    private _maxFontSize = 20;

    private readonly _marginTop: number;
    private readonly _marginBottom: number;
    private readonly _maxTexts: number;

    public constructor(
        private readonly _settings: Settings,
        private readonly _textDirection: Direction,
        private _width: number,
        private _height: number,
        private readonly _world: World,
        private readonly _view: TextFlowView,
        private readonly _texts: string[]
    ) {
        this._marginTop = this._settings.marginTop;
        this._marginBottom = this._settings.marginBottom;
        this._maxTexts = this._settings.maxTexts;

        this.updateFontSizes();
    }

    public addText() {
        if (!this._isRunning) {
            return;
        }

        if (this._world.elements.length >= this._maxTexts) {
            this._textId = this.randomSetTimeout(
                () => this.addText(), this._settings.minSpawnMs, this._settings.maxSpawnMs
            );
            return;
        }

        const fontSize = this.random(this._minFontSize, this._maxFontSize);
        const text = this._texts[this.random(this._texts.length)];

        this._view.setFontSize(fontSize);
        const textWidth = this._view.measureText(text);

        const baseSpeed = this.random(1, this._settings.maxAcceleration + 1);

        let xPosition;
        let yPosition;

        const dirX = this._textDirection.x;
        const dirY = this._textDirection.y;

        if (dirX > 0) {
            xPosition = -textWidth;
        } else if (dirX < 0) {
            xPosition = this._width;
        } else {
            xPosition = this.random(0, this._width - textWidth);
        }

        if (dirY > 0) {
            yPosition = -fontSize + this._marginTop;
        } else if (dirY < 0) {
            yPosition = this._height + this._marginBottom + fontSize;
        } else {
            yPosition = this.random(this._marginTop, this._height - this._marginBottom - fontSize);
        }

        if (this._textDirection.isDiagonal) {
            if (Math.random() > 0.5) {
                yPosition = this.random(this._marginTop, this._height - this._marginBottom - fontSize);
            } else {
                xPosition = this.random(0, this._width - textWidth);
            }
        }

        const textElement = new TextElement(
            xPosition,
            yPosition,
            baseSpeed,
            textWidth,
            fontSize,
            text,
            fontSize,
            this._textDirection,
            this._settings
        );

        this._world.addElement(textElement);
        textElement.start();

        this._textId = this.randomSetTimeout(
            () => this.addText(), this._settings.minSpawnMs, this._settings.maxSpawnMs
        );
    }

    public resize(width: number, height: number) {
        this._width = width;
        this._height = height;
        this.updateFontSizes();
    }

    public start() {
        if (!this._isRunning) {
            this._isRunning = true;
            this.addText();
        }
    }

    public stop() {
        this._isRunning = false;
        if (this._textId !== undefined) {
            window.clearTimeout(this._textId);
            this._textId = undefined;
        }
    }

    private updateFontSizes() {
        if (typeof window !== 'undefined') {
            this._minFontSize = window.innerWidth <= 800 ? 12 : 16;
            this._maxFontSize = window.innerWidth <= 800 ? 16 : 20;
        }
    }

    private random(minVal: number, maxVal?: number): number {
        if (maxVal !== undefined) {
            return minVal + Math.floor(Math.random() * (maxVal - minVal + 1));
        }
        return Math.floor(Math.random() * minVal);
    }

    private randomSetTimeout(func: Function, minVal: number, maxVal?: number): number {
        return window.setTimeout(() => func(), this.random(minVal, maxVal));
    }
}
