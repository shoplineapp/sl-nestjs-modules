const yargs = require('yargs');

console.log('hello');

function main() {}

yargs
  .command({
    command: '$0',
    describe: 'create changelog',
    builder: (command) => command,
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
