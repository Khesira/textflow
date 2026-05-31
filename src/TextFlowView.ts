import type { World } from "./World";
import type { Settings } from "./types";

export class TextFlowView {
    private _renderId: number = 0;

    public constructor(
        private readonly _settings: Settings,
        private readonly _target: HTMLElement,
        private readonly _canvas: HTMLCanvasElement,
        private readonly _context2d: CanvasRenderingContext2D,
        private readonly _world: World,
    ) {
        this._target.style.display = 'block';
        this._target.style.width = '100%';
        this._target.style.height = this._settings.height;
        this._target.style.background = this._settings.background;
    }

    public setFontSize(fontSize: number) {
        this._context2d.font = `${fontSize}pt ${this._settings.font}`;
    }

    public measureText(text: string): number {
        return this._context2d.measureText(text).width;
    }

    public resize() {
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

        this._canvas.width = this._target.clientWidth * dpr;
        this._canvas.height = this._target.clientHeight * dpr;

        this._canvas.style.width = `${this._target.clientWidth}px`;
        this._canvas.style.height = `${this._target.clientHeight}px`;

        this._context2d.scale(dpr, dpr);
    }

    public clear() {
        if (!this._context2d) {
            return;
        }

        const oldFillStyle = this._context2d.fillStyle;
        this._context2d.fillStyle = this._settings.debug ? 'rgba(255, 255, 0, 1)' : this._settings.background;

        this._context2d.fillRect(0, 0, this._target.clientWidth, this._target.clientHeight);
        this._context2d.fillStyle = oldFillStyle;
    }

    public start() {
        if (!this._context2d) {
            return;
        }

        this._context2d.textAlign = 'start';

        if (this._renderId === 0) {
            this.renderView();
        }
    }

    public stop() {
        if (this._renderId !== 0) {
            cancelAnimationFrame(this._renderId);
            this._renderId = 0;
        }
        this.clear();
    }

    private renderView = () => {
        if (!this._context2d) {
            return;
        }

        this.clear();

        for (let element of this._world.elements) {
            this._context2d.font = element.font;

            if (this._settings.debug) {
                this._context2d.fillStyle = '#ff0000';
                this._context2d.fillRect(
                    element.positionX,
                    element.positionY - element.height,
                    element.width,
                    element.height
                );
            }

            this._context2d.fillStyle = element.color;
            this._context2d.fillText(element.text, element.positionX, element.positionY);
        }

        this._renderId = requestAnimationFrame(this.renderView);
    }
}
