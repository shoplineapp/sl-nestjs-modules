# sl-nest-module

Collection of shared nestjs module used in developer-center apps

## Packages

| Package                                           | Version |
| ------------------------------------------------- | ------- |
| [@sl-nest-module/dev-oauth](packages/dev-oauth)   | 0.0.1   |
| [@sl-nest-module/aws-lambda](packages/aws-lambda) | 0.0.1   |

## Development

### Local npm registry

For local development, you may start a local npm registry with the command `yarn local-npm`, which can be viewed on in the browser at http://localhost:4879. To publish packages to your local registry, run `yarn release:publish:dry`, which will scan all packages and publish them if their current version cannot be found in the registry.

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
