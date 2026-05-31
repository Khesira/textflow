import type {Settings} from "./types.ts";
import {type Heading, VECTOR_MAPPING} from "./Direction.ts";

const cssLengthRegex = /^(?:0|(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ch|ex|lh|rlh|svh|lvh|dvh|svw|lvw|dvw))$/i;

export const defaultSettings: Settings = {
    height: '200px',
    maxTexts: 15,
    maxAcceleration: 15,
    headings: ['EAST', 'WEST'],
    marginTop: 0,
    marginBottom: 0,
    minSpawnMs: 1000,
    maxSpawnMs: 2500,
    texts: ['Add', 'your', 'own', 'texts', 'here'],
    color: '#333',
    background: 'rgba(255, 255, 255, 1)',
    font: 'sans-serif',
    debug: false
};

export function sanitizeSettings(userSettings: any): Settings {
    const safeSettings = { ...defaultSettings };

    if (typeof userSettings.maxTexts === 'number' && userSettings.maxTexts > 0) {
        safeSettings.maxTexts = Math.floor(userSettings.maxTexts);
    } else if (userSettings.maxTexts !== undefined) {
        console.warn(`[textflow] Invalid maxTexts "${userSettings.maxTexts}". Using default: ${defaultSettings.maxTexts}`);
    }

    if (typeof userSettings.maxAcceleration === 'number' && userSettings.maxAcceleration > 0) {
        safeSettings.maxAcceleration = userSettings.maxAcceleration;
    }

    if (Array.isArray(userSettings.headings)) {
        const validHeadings = userSettings.headings.filter((dir: any) => {
            return typeof dir === 'string' && dir.toUpperCase() in VECTOR_MAPPING;
        }) as Heading[];

        if (validHeadings.length > 0) {
            safeSettings.headings = validHeadings;
        }
    }

    if (typeof userSettings.marginTop === 'number' && userSettings.marginTop >= 0) {
        safeSettings.marginTop = userSettings.marginTop;
    }
    if (typeof userSettings.marginBottom === 'number' && userSettings.marginBottom >= 0) {
        safeSettings.marginBottom = userSettings.marginBottom;
    }

    if (typeof userSettings.minSpawnMs === 'number' && userSettings.minSpawnMs >= 15) {
        safeSettings.minSpawnMs = userSettings.minSpawnMs;
    }
    if (typeof userSettings.maxSpawnMs === 'number' && userSettings.maxSpawnMs >= 15 && userSettings.maxSpawnMs >= userSettings.minSpawnMs) {
        safeSettings.maxSpawnMs = userSettings.maxSpawnMs;
    }

    if (typeof userSettings.font === 'string' && userSettings.font.trim() !== '') {
        safeSettings.font = userSettings.font;
    }
    if (typeof userSettings.color === 'string' && userSettings.color.trim() !== '') {
        safeSettings.color = userSettings.color;
    }
    if (typeof userSettings.background === 'string' && userSettings.background.trim() !== '') {
        safeSettings.background = userSettings.background;
    }

    if (typeof userSettings.height === 'string' && cssLengthRegex.test(userSettings.height.trim())) {
        safeSettings.height = userSettings.height;
    }

    if (userSettings.debug !== undefined) {
        safeSettings.debug = Boolean(userSettings.debug);
    }

    return safeSettings;
}
