import { World } from './World';
import { TextFlowView } from './TextFlowView';
import { TextWriter } from './TextWriter';
import {defaultSettings, sanitizeSettings} from './settings';
import { Direction } from "./Direction.ts";
import type { Settings } from './types'

export type { Settings };
export class TextFlowElement extends HTMLElement {
    private active: boolean = false;
    private resizeObserver: ResizeObserver | null = null;

    private world!: World;
    private view!: TextFlowView;
    private textWriter!: TextWriter;

    private animationFrameId: number | null = null;

    connectedCallback() {
        this.innerHTML = `
            <div class="slider-container">
                <canvas class="physics-canvas"></canvas>
            </div>
        `;

        const canvas = this.querySelector<HTMLCanvasElement>('.physics-canvas')!;
        const context2d = canvas.getContext('2d');

        if (!context2d) {
            console.error('Could not get context2d');
            return;
        }

        const rawSettings = this.dataset.settings;
        const userSettings = rawSettings ? JSON.parse(rawSettings) : defaultSettings;
        const settings = sanitizeSettings(userSettings);

        const rawTexts = this.dataset.texts;
        const texts = rawTexts ? JSON.parse(rawTexts) : settings.texts;

        const screenReaderList = this.generateScreenReaderTextList(texts);
        this.querySelector('ul.sr-only')?.remove();
        canvas.appendChild(screenReaderList);

        const textDirection = Direction.randomDirection(settings.headings);

        this.world = new World(textDirection);

        this.view = new TextFlowView(
            settings,
            this,
            canvas,
            context2d,
            this.world
        );

        this.textWriter = new TextWriter(
            settings,
            textDirection,
            this.offsetWidth,
            this.offsetHeight,
            this.world,
            this.view,
            texts
        );

        this.startLoop();

        document.addEventListener('visibilitychange', this.visibilityChange);

        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });

        this.resizeObserver.observe(this);
    }

    disconnectedCallback() {
        this.stopLoop();

        document.removeEventListener('visibilitychange', this.visibilityChange);

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    private loop = () => {
        if (!this.active) return;

        // this.world.update();
        // this.view.render();

        this.animationFrameId = window.requestAnimationFrame(this.loop);
    }

    private startLoop = () => {
        if (!this.active) {
            this.view.start();
            this.world.start();
            this.textWriter.start();
            this.active = true;

            this.animationFrameId = window.requestAnimationFrame(this.loop);
        }
    }

    private stopLoop() {
        if (this.active) {
            this.view.stop();
            this.world.stop();
            this.textWriter.stop();
            this.active = false;

            if (this.animationFrameId) {
                window.cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
        }
    }

    private resize() {
        this.view.resize();
        this.world.resize(this.offsetWidth, this.offsetHeight);
        this.textWriter.resize(this.offsetWidth, this.offsetHeight);
    }

    private visibilityChange = () => {
        if (document.hidden) {
            this.stopLoop();
        } else {
            this.startLoop();
        }
    }

    private generateScreenReaderTextList(texts: string[]): HTMLUListElement {
        const ul = document.createElement('ul');
        ul.className = 'sr-only';
        ul.setAttribute('aria-label', 'Currently flowing words on the canvas');

        texts.forEach((text) => {
            const li = document.createElement('li');
            li.textContent = text;
            ul.appendChild(li);
        });

        return ul;
    }
}

export function registerTextFlowSlider(tagName = 'textflow-container') {
    if (typeof window !== 'undefined' && !customElements.get(tagName)) {
        customElements.define(tagName, TextFlowElement);
    }
}
