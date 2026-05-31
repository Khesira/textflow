# @khesira/textflow

A lightweight, high-performance, framework-agnostic canvas physics text slider written in TypeScript.

This library packages a 2D physics engine into a native **Web Component (Custom Element)**, allowing you to create beautiful, dynamic text streams that float and collide organically across the screen. It works seamlessly with **Astro, Svelte, Vue, React**, or pure HTML.

---

## Features

* 🚀 **Framework Agnostic:** Built on the native Web Components standard. Zero runtime dependencies.
* 🛡️ **Resource-Efficient & Leak-Proof:** Automatically pauses the physics loops when the browser tab is blurred (`visibilitychange`) or the element is removed from the DOM (`disconnectedCallback`).
* 🖥️ **High-DPI / Retina Ready:** Canvas automatically scales with `window.devicePixelRatio` for razor-sharp text rendering on 4K and OLED displays.
* 🧠 **Smart Physics-Engine:** Text speed and impulse-exchange upon collision are calculated based on the text's font size (mass-inertia principle).
* ⚙️ **Runtime Validated:** Built-in sanitization catches malformed JSON configuration gracefully without crashing the engine.

---

## Installation

Install the package via your favorite package manager:

```bash
bun add @khesira/textflow
# or npm install @khesira/textflow
```

## Usage

### 1. In Astro (or similar Frontend Frameworks)
   Register the custom element in your client-side script and pass your configuration via data-* attributes.

```html
---
import type { Settings } from '@khesira/textflow';

interface Props {
    texts: string[];
}

const { texts } = Astro.props;

const settings: Settings = {
    font: "Inter, sans-serif",
    color: "#ffffff",
    background: "transparent",
    maxTexts: 12,
    maxAcceleration: 4,
    marginTop: 20,
    marginBottom: 20,
    debug: false
};
---

<textflow-container
    data-texts={JSON.stringify(texts)} 
    data-settings={JSON.stringify(settings)}
></textflow-container>

<script>
    import { registerTextFlowSlider } from '@khesira/textflow';
    
    // Teaches the browser the new HTML tag <textflow-container>
    registerTextFlowSlider();
</script>
```

### 2. Pure HTML / JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TextFlow Demo</title>
    <style>
        body { background: #111; }
        textflow-container { margin: 2rem auto; }
    </style>
</head>
<body>

    <textflow-container 
        data-texts='["TypeScript", "Bun", "Astro", "Canvas", "Physics"]'
        data-settings='{"maxTexts": 8, "color": "#00ffcc"}'>
    </textflow-container>

    <script type="module">
        import { registerTextFlowSlider } from './node_modules/@khesira/textflow/dist/textflow.js';
        registerTextFlowSlider();
    </script>
</body>
</html>
```

## Configuration (Settings)

The component always fills the available width of its host container. Control the width using regular CSS on the element or its parent. The height can be configured via settings.

| Property          | Type        | Default Value     | Description                                                            |
|:------------------|:------------|:------------------|:-----------------------------------------------------------------------|
| `height`          | `string`    | `"200px"`         | CSS height of the slider component.                                    |
| `font`            | `string`    | `"sans-serif"`    | Font family used inside the Canvas rendering context.                  |
| `color`           | `string`    | `"#ffffff"`       | Text color (accepts hex, rgb, rgba, or CSS color names).               |
| `background`      | `string`    | `"transparent"`   | Background color of the canvas container.                              |
| `maxTexts`        | `number`    | `10`              | Maximum number of text elements allowed on screen simultaneously.      |
| `maxAcceleration` | `number`    | `3`               | Maximum velocity cap for the text particles.                           |
| `headings`        | `Heading[]` | `['EAST','WEST']` | Flow directions of the texts picked randomly on each page load.        |
| `minSpawnMs`      | `number`    | `1000`            | The minimum timespan of spawning a new text.                           |
| `maxSpawnMs`      | `number`    | `2500`            | The maximum timespan of spawning a new text.                           |
| `marginTop`       | `number`    | `0`               | Top boundary padding (in pixels) to restrict the spawn area.           |
| `marginBottom`    | `number`    | `0`               | Bottom boundary padding (in pixels) to restrict the spawn area.        |
| `debug`           | `boolean`   | `false`           | Enables red AABB bounding boxes and highlights the canvas clear zones. |

### Headings

The `headings` setting controls the possible flow directions. On each page load, one direction is picked randomly from the provided list.

Allowed values:

'NORTH' | 'NORTHEAST' | 'EAST' | 'SOUTHEAST' | 'SOUTH' | 'SOUTHWEST' | 'WEST' | 'NORTHWEST' | 'NONE'

### Spawn rates

The values for `minSpawnMs` and `maxSpawnMs` control the timespan between text texts spawn. Each cycle any random value between `minSpawnMs` and `maxSpawnMs` is picked and a new text is spawned after that period of time. 

### Usage

```typescript
const settings: Partial<Settings> = {
    headings: ['NORTH', 'SOUTHEAST', 'WEST'],
    // ...
};
```

Use `Partial<Settings>` to allow for optional properties.

## Architecture

The library follows a strict Model-View-Controller (MVC) inspired architecture to decouple data, state machine, and side effects:

- TextElement: Represents the physical text particle, housing position, speed, and bounding box.
- World: The state machine driving the physics engine, handling backward-loop garbage collection, and processing 2D broad-phase collisions.
- TextFlowView: Isolated rendering layer that handles drawing text onto the high-DPI scaled 2D context.
- TextWriter: Factory class that manages the pseudo-randomized generation of new TextElement batches based on viewport requirements.
- TextFlowElement: The HTML Custom Element orchestrating the components and bridging browser lifecycles.

## License

MIT License – feel free to use it in your personal portfolio or commercial projects!
