/**
 * test publish npm
 */
const { spawn } = require('child_process');
const rimraf = require('rimraf');
const path = require('path');

const basePath = path.resolve(process.cwd());
const pipeStdIo = { stdio: [process.stdin, process.stdout, process.stderr] };

/* Main */
{
  (async () => {
    try {
      // remove local npm storage
      rimraf.sync(path.resolve(basePath, './local-npm-storage'));

      // create local npm process
      const localNpm = spawn('yarn', ['local-npm'], pipeStdIo).on('error', (e) => {
        throw e;
      });

      // publish packages to local npm
      spawn('yarn', ['release:publish:dry'], pipeStdIo).on('close', (code) => {
        localNpm.kill();
        if (code !== 0) throw new Error(`exit code is ${code}`);
      });
    } catch (error) {
      console.error('caught an error on publish-npm.local', err);
      process.exit(1);
    }
  })();
}
/* END: Main */
