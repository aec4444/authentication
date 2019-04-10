// angular and 3rd party imports
import { Injectable, Inject, Injector, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { GafAuth0Browser, GafAuth0Settings, GafAuth0Callbacks } from '@gaf/typescript-authentication-auth0';
import { IGafAuth0Service } from '../IGafAuth0Service';
import { GafTokenManagerService } from '../../token-manager/gaf-token-manager.service';
import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { CreateGafAuth0CallbacksTypescript } from '../../config/gaf-auth0-callbacks-typescript';

@Injectable({
  providedIn: 'root'
})
export class GafAuth0BrowserService extends GafAuth0Browser implements IGafAuth0Service {
  public onAuthenticationChanged = new EventEmitter<boolean>();
  public onRenewError = new EventEmitter<any>();

  constructor(
    @Inject('GafAuth0Settings') public config: GafAuth0Settings,
    @Inject('GafAuth0Callbacks') public callbacksAngular: GafAuth0Callbacks,
    protected tokenManager: GafTokenManagerService,
    protected injector: Injector,
    public storage: GafStorageManager
  ) {
    super(
      config,
      CreateGafAuth0CallbacksTypescript(callbacksAngular),
      tokenManager,
      storage
    );

    this.callbacks.onAuthenticationChanged = (success: boolean) => this.onAuthenticationChanged.emit(success);
    this.callbacks.onRenewError = (error: any) => this.onRenewError.emit(error);
  }
}
