import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'TextFlow',
            fileName: (format) => `textflow.${format}.js`,
        },
        rollupOptions: {
            external: [],
        },
    },
    plugins: [dts({ insertTypesEntry: true })],
});
