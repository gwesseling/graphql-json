import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "build",
    bundle: true,
    dts: true,
    platform: "node",
    target: ["esnext", "node10.4"],
    sourcemap: true,
    minify: "terser",
    external: ["graphql"],
    clean: true,
    outExtension({format}) {
        return {
            js: `.${format}.js`,
        };
    },
});
