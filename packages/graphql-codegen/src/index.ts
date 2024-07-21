import childProcess from "child_process";
import {getBinaryPath} from "./utils";

type Config = {
    inputFile?: string;
    outputFile?: string;
};

/**
 * Generate Graphql schema
 */
function codegen(config: Config = {}) {
    const args: Array<string> = [];

    if (config.inputFile) {
        args.push(`--inputFile=${config.inputFile}`);
    }

    if (config.outputFile) {
        args.push(`--outputFile=${config.outputFile}`);
    }

    return new Promise((resolve, reject) => {
        const path = getBinaryPath();

        if (!path) {
            return reject(new Error("Unsupported operating system or architecture"));
        }

        childProcess.execFile(path, args, {}, (err, stdout) => {
            if (err) return reject(err);

            return resolve(stdout);
        });
    });
}

export {codegen, getBinaryPath};
