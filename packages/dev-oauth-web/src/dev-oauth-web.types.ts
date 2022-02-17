/** A token from the Developer OAuth server */
export type DeveloperOAuthToken = {
  tokenType: 'Bearer';
  accessToken: string;
  refreshToken: string;
  createdAt: number;
  expiresIn: number;
  scope: string;
  merchantId: string;
  performerId?: string;
};

export type DeveloperOAuthTokenInfoMerchant = {
  id: string;
  email: string;
  handle: string;
  name: string;
};

export type DeveloperOAuthTokenInfoStaff = {
  id: string;
  email: string;
  locale: string;
  merchantIdList: string[];
  name: string;
};

/** Information of a token from the Developer OAuth server */
export type DeveloperOAuthTokenInfo = {
  scope: string[];
  merchant: DeveloperOAuthTokenInfoMerchant;
  staff: DeveloperOAuthTokenInfoStaff;
};

/** Raw response body from Developer OAuth server's token endpoint */
export type DeveloperOAuthTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  resource_owner_id: string;
};

/** Raw response body from Developer OAuth server's token info endpoint */
export type DeveloperOAuthTokenInfoResponse = {
  resource_owner_id: string;
  scope: string[];
  expires_in: number;
  application: {
    uid: string;
    key?: any;
    id?: any;
  };
  created_at: number;
  staff: {
    _id: string;
    email: string;
    locale_code: string;
    merchant_ids: string[];
    name: string;
  };
  merchant: {
    _id: string;
    email: string;
    handle: string;
    name: string;
  };
};
