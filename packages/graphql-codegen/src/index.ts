import childProcess from "child_process";

/**
 * Get binary path
 */
function getPath() {
    // TODO: resolve package
    return require.resolve("@graphql-json/win32-x64/graphql-codegen.exe");

    // resolve fallback path
    // return path.join(__dirname, "..", "bin", "graphql-codegen");
}

/**
 * Generate Graphql schema
 */
function codegen(args) {
    return new Promise((resolve, reject) => {
        const path = getPath();
        childProcess.execFile(path, args, {}, (err, stdout) => {
            if (err) return reject(err);

            return resolve(stdout);
        });
    });
}

export {codegen};
