// app imports
import { GafAuth0BrowserService } from './gaf-auth0-browser.service';
import { GafTokenManagerService } from '../../token-manager/gaf-token-manager.service';
import { GafAuth0Interceptor } from '../../interceptor/gaf-auth0.interceptor';
import { GafAuth0InterceptorSettings } from '../../config/gaf-auth0-interceptor-settings';
import { GafAuth0Callbacks } from '../../config/gaf-auth0-callbacks';
import { GafAuth0CanActivate } from '../../gaf-auth0-can-activate/gaf-auth0-can-activate.routeguard';
import { GafAuth0BrowserStorageService } from '../../storage/browser/gaf-auth0-browser-storage.service';
import { GafAuth0CallbackModule } from '../../callback/gaf-auth0-callback.module';

// npm imports
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuthenticationMode, GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Service } from '../gaf-auth0-service';

@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    GafAuth0CallbackModule,
    RouterModule
  ],
  exports: [
  ]
})
export class GafAuth0BrowserModule {
  static forRoot(
    config: GafAuth0Settings,
    interceptorConfig?: GafAuth0InterceptorSettings,
    callbacks?: GafAuth0Callbacks
  ): ModuleWithProviders {

    if (config !== undefined) {
      if (config.mode === undefined) {
        config.mode = GafAuthenticationMode.Child;
      }
    }

    if (interceptorConfig === undefined) {
      interceptorConfig = new GafAuth0InterceptorSettings();
    }

    if (callbacks === undefined) {
      callbacks = {};
    }

    return {
      ngModule: GafAuth0BrowserModule,
      providers: [
        { provide: GafAuth0Service, useClass: GafAuth0BrowserService},
        GafTokenManagerService,
        { provide: GafStorageManager, useClass: GafAuth0BrowserStorageService},
        GafAuth0CanActivate,
        { provide: HTTP_INTERCEPTORS, useClass: GafAuth0Interceptor, multi: true},
        { provide: 'GafAuth0Settings', useValue: config},
        { provide: 'GafAuth0InterceptorSettings', useValue: interceptorConfig},
        { provide: 'GafAuth0Callbacks', useValue: callbacks}
      ]
    };
  }

  constructor(private authService: GafAuth0Service) {
    this.authService.start();
  }
}
