export interface GafAuth0Callbacks {
  HandleAuthenticationSuccess?(): void;
  HandleAuthenticationFailure?(): void;
  GetScopesKeyFromUrl?(url: string): string;
  onAuthenticationChanged?(loggedIn: boolean): void;
  onRenewError?(error: any): void;
}
