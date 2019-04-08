import { GafAuthenticationMode } from '@gaf/typescript-authentication-general';

export interface GafAuth0SettingsAudienceScope {
  scopes: string[];
  audience: string;
  key: string;
}

export interface GafAuth0Settings {
  clientId: string;
  domain: string;
  audience: string;
  authorize?: {
    scopes?: string;
    responseType?: string;
  };
  scopes?: string[] | GafAuth0SettingsAudienceScope[];
  logoutUri?: string;
  loginUri: string;
  silentUri?: string;
  accessTokenThreshold?: number;
  idTokenThreshold?: number;
  redirectUri?: string;
  mode?: GafAuthenticationMode;
  whitelistDomains?: Array<string | RegExp>;
}
