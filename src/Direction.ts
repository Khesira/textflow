export type Heading =
    'NORTH'
    | 'NORTHEAST'
    | 'EAST'
    | 'SOUTHEAST'
    | 'SOUTH'
    | 'SOUTHWEST'
    | 'WEST'
    | 'NORTHWEST'
    | 'NONE';

export const VECTOR_MAPPING: Record<Heading, { readonly x: number; readonly y: number }> = {
    NORTH: {x: 0, y: -1},
    NORTHEAST: {x: 1, y: -1},
    EAST: {x: 1, y: 0},
    SOUTHEAST: {x: 1, y: 1},
    SOUTH: {x: 0, y: 1},
    SOUTHWEST: {x: -1, y: 1},
    WEST: {x: -1, y: 0},
    NORTHWEST: {x: -1, y: -1},
    NONE: {x: 0, y: 0}
};

export class Direction {
    private constructor(public readonly heading: Heading) {
    }

    public static from(heading: Heading): Direction {
        return new Direction(heading);
    }

    public static randomDirection(availableDirections: readonly Heading[] = ['EAST', 'WEST']): Direction {
        const activeHeading = availableDirections[Math.floor(Math.random() * availableDirections.length)];
        return Direction.from(activeHeading);
    }

    get x(): number {
        return VECTOR_MAPPING[this.heading].x;
    }

    get y(): number {
        return VECTOR_MAPPING[this.heading].y;
    }

    get isVertical(): boolean {
        return this.x === 0 && this.y !== 0;
    }

    get isHorizontal(): boolean {
        return this.y === 0 && this.x !== 0;
    }

    get isDiagonal(): boolean {
        return this.x !== 0 && this.y !== 0;
    }
}
