export interface GafAuth0Callbacks {
  GetScopesKeyFromUrl?(url: string): string;
  onAuthenticationChanged?(loggedIn: boolean): void;
  onRenewError?(error: any): void;
}
