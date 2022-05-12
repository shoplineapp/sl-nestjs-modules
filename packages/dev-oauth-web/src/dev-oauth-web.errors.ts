export class DeveloperOAuthTokenInfoNotFoundError extends Error {
  constructor() {
    super('The developer oauth token info cannot be found');
  }
}

export class DeveloperOAuthTokenNotFoundError extends Error {
  constructor() {
    super('The developer oauth token cannot be found');
  }
}

export class DeveloperOAuthUnauthorizedError extends Error {
  constructor() {
    super('Unauthorized to access the resource');
  }
}
