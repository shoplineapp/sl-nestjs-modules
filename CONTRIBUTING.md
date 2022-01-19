# Contributing to sl-nestjs-module

Before contributing to this project, please read the following carefully.

## Project structure

This project is a monorepo structured using [Lerna](https://github.com/lerna/lerna). It contains several different packages in the `packages` directory, each package being self-contained and has its own `package.json` defining its own version and dependencies

_File structure of a minimal package_

```
.
└── hello-world
    ├── src
    │   ├── hello-world.module.ts
    │   ├── hello-world.service.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

## Creating a new package

The fastest way to create a new package would be to copy all files from an existing package and modify several places,

- For `package.json`, modify `name` and `version`, and remove any `dependencies` you don't need
- Remove all files in `src` except the `*.module.ts`, `*service.ts`, and `index.ts`. And rename them with your package name

## Testing with local npm registry

In order to verify that a package is working as intended, you should install the package in another project from a local npm registry, and test the package's functionalities in that project.

You may start a local npm registry with the command `yarn local-npm`, which can be viewed on in the browser at http://localhost:4879. To publish packages to your local registry, run `yarn release:publish:dry`, which will scan all packages and publish them if their current version cannot be found in the registry.

_Hint: To republish a package after modifying it, either bump the package version or delete the `.local-npm-storage` directory in project root, or else the package will not be republished._

In order to verify that the package is working as intended, you may install the package in another project by configuring the other project's yarn/npm to install from your local registry.

To configure yarn to use the local registry, add this to `yarnrc.yml`

```yml
# yarnrc.yml

npmScopes:
  'sl-nest-module':
    npmRegistryServer: http://localhost:4879
unsafeHttpWhitelist:
  - 'localhost'
```

To configure npm to the use local registry, add this to `.npmrc`

```
@sl-nest-module:registry=http://localhost:4879
```

_Hint: If you need to install your local package in CI environment, you may use [ngrok](https://ngrok.com/) to generate a url pointing to your local registry and use that url in `yarnrc.yml` or `.npmrc`_

## Publishing to npm

Before publishing your packages to npm, make sure you have logged in to your npm account using [`npm login`](https://docs.npmjs.com/cli/v7/commands/npm-adduser) or by adding `//registry.npmjs.org/:_authToken=<token>` to your `.npmrc`. For more on npm token, see [here](https://docs.npmjs.com/creating-and-viewing-access-tokens).

To publish new packages, run `yarn release:publish`, which will scan all packages and publish them if their current version cannot be found in the registry. If you have any packages that are still in progress that should not be published yet, you can add `private: true` in its `package.json` to prevent it from being published.
