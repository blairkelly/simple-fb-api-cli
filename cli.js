/*
Please note: You must build the project before you can use this module.
*/

const fork = require('child_process').fork;

const forkArgs = [].concat(
    process.argv.slice(2, process.argv.length)
);

const proc = fork(
    "./dist/cli.js",
    forkArgs,
    {
        stdio: 'inherit',
    }
);

proc.on("exit", (code) => {
    process.exitCode = code;
});
