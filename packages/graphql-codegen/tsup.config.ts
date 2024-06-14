import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "build",
    bundle: true,
    dts: true,
    platform: "node",
    target: ["esnext", "node10.4"],
    treeshake: true,
    splitting: true,
    clean: true,
    outExtension({format}) {
        return {
            js: `.${format}.js`,
        };
    },
});
