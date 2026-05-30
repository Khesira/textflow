export interface Direction {
    x: number;
    y: number;
}

export const directions = {
    none: { x: 0, y: 0 },
    north: { x: 0, y: -1 },
    northEast: { x: 1, y: -1 },
    east: { x: 1, y: 0 },
    southEast: { x: 1, y: 1 },
    south: { x: 0, y: 1 },
    southWest: { x: -1, y: 1 },
    west: { x: -1, y: 0 },
    northWest: { x: -1, y: -1 },
} as const satisfies Record<string, Direction>;

export const defaultDirections = Object.values(directions);

export function randomDirection(
    availableDirections: readonly Direction[] = defaultDirections,
): Direction {
    return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}
