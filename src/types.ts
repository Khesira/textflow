import type {Heading} from "./Direction.ts";

export enum CollisionAxis {
    Horizontal,
    Vertical
}

export interface BoundingBox {
    top: number,
    right: number,
    bottom: number,
    left: number,
}

export interface Settings {
    height: string;
    maxTexts: number;
    maxAcceleration: number;
    headings: Heading[],
    marginTop: number;
    marginBottom: number;
    minSpawnMs: number;
    maxSpawnMs: number;
    texts: string[];
    color: string;
    background: string;
    font: string;
    debug: boolean;
}
