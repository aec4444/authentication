/* istanbul ignore next */
// angular and 3rd party imports
import { Injectable, Inject, Injector, EventEmitter } from '@angular/core';

// app imports
import { GafAuth0Settings, GafAuth0, WindowLocationMock } from '@gaf/typescript-authentication-auth0';
import { GafTokenManagerService } from '../token-manager/gaf-token-manager.service';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { CreateGafAuth0CallbacksTypescript } from '../config/gaf-auth0-callbacks-typescript';
import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { IGafAuth0Service } from '../service/IGafAuth0Service';

@Injectable({
  providedIn: 'root'
})
export class GafAuth0MockService extends GafAuth0 implements IGafAuth0Service {
  //#region configure auth0 WebAuth
  private _loggedIn = false;
  public onAuthenticationChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  public onRenewError: EventEmitter<any> = new EventEmitter<any>();
  //#endregion

  constructor(
    @Inject('GafAuth0Settings') public config: GafAuth0Settings,
    @Inject('GafAuth0Callbacks') public callbacksAngular: GafAuth0Callbacks,
    protected tokenManager: GafTokenManagerService,
    protected injector: Injector,
    public storage: GafStorageManager,
  ) {
    super(
      config,
      CreateGafAuth0CallbacksTypescript(callbacksAngular),
      tokenManager,
      storage,
      new WindowLocationMock()
    );

    // add after super
    this.callbacks.onAuthenticationChanged = (success: boolean) => this.onAuthenticationChanged.emit(success);
    this.callbacks.onRenewError = (error: any) => this.onRenewError.emit(error);
  }

  //#region Public Interface
  /**
   * Login to Auth0
   */

  public start(): void {
    // do nothing
  }

  public login(): void {
      this._loggedIn = true;
  }

  public logout(): void {
      this._loggedIn = false;
  }

  public get isAuthenticated(): boolean {
      return this._loggedIn;
  }

  public renewIdToken() {
    // do nothing
  }

  /**
   * Get the email address from the session storage for other usages
   */
  public getEmail(): string {
    if (this.isAuthenticated && this.storage.info !== undefined && this.storage.info.profile.email !== null) {
      return this.storage.info.profile.email;
    }

    return '';
  }

  public handleAuthentication(): Promise<boolean> {
    return Promise.resolve(this._loggedIn);
  }

  public getAccessToken(url?: string): Promise<string> {
    return Promise.resolve('test token');
  }
  //#endregion
}
