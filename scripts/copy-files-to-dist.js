/**
 * This script is expected to run on each package root
 */

const { constants: fsConstants } = require('fs');
const { copyFile, access, writeFile } = require('fs/promises');
const { defer, of, concat } = require('rxjs');
const { mergeMap, map } = require('rxjs/operators');
const path = require('path');

const packageRoot = process.cwd();
const distPath = path.resolve(packageRoot, './dist');

const copyLicense$ = defer(async () => {
  const licenseFilepath = path.resolve(packageRoot, '../../LICENSE');
  await copyFile(licenseFilepath, path.resolve(distPath, 'LICENSE'));
});

const copyReadme$ = of(path.resolve(packageRoot, 'README.md')).pipe(
  mergeMap(async (readmePath) => {
    if (await fileExist(readmePath)) return readmePath;
    // default README
    return path.resolve(packageRoot, '../../README.md');
  }),
  mergeMap(async (readmePath) => {
    await copyFile(readmePath, path.resolve(distPath, 'README.md'));
  })
);

const copyPackageJson$ = of(require(path.resolve(packageRoot, './package.json'))).pipe(
  map(({ name, version, dependencies, peerDependencies }) => ({
    name,
    version,
    license: 'MIT',
    main: './index.js',
    types: './index.d.ts',
    ...(dependencies && { dependencies }),
    ...(peerDependencies && { peerDependencies }),
  })),
  mergeMap(async (packageJson) => {
    await writeFile(path.resolve(distPath, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf-8');
  })
);

/* Main */
{
  (() => {
    concat(copyLicense$, copyReadme$, copyPackageJson$).subscribe({
      error: (err) => {
        console.error('caught an error on copy-files-to-dist', err);
        process.exit(1);
      },
    });
  })();
}
/* END: Main */

/* helper functions */
async function fileExist(path) {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
/* END: helper functions */
