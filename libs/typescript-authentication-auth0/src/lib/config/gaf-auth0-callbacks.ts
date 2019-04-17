export interface GafAuth0Callbacks {
  getScopesKeyFromUrl?(url: string): string;
  onAuthenticationChanged?(loggedIn: boolean): void;
  onRenewError?(error: any): void;
  handleAuthenticationSuccess?(): void;
  handleAuthenticationFailure?(): void;
}
