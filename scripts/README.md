# `sl-nest-module` Scripts

## Release

### Preperation

The following steps must be proposed as a pull request.

1. Run `yarn release:changelog`
2. Append the message into the `CHANGELOG.md`
3. Run `yarn release:version`
4. Open PR for the changes

### Release packages

1. checkout the merged PR
2. Run `yarn`
3. Run `yarn build:sl-nest-module`
4. Run `yarn release:publish`
5. Run `yarn release:tag`
