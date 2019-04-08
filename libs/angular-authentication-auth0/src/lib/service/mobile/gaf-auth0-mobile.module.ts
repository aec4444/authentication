import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/core';

// app imports
import { GafAuth0InterceptorSettings } from '../../config/gaf-auth0-interceptor-settings';
import { GafAuth0Callbacks } from '../../config/gaf-auth0-callbacks';
import { GafAuth0MobileService } from './gaf-auth0-mobile.service';
import { GafTokenManagerService } from '../../token-manager/gaf-token-manager.service';
import { GafAuth0MemoryStorageService } from '../../storage/memory/gaf-auth0-memory-storage.service';
import { GafAuth0CanActivate } from '../../gaf-auth0-can-activate/gaf-auth0-can-activate.routeguard';
import { GafAuth0Interceptor } from '../../interceptor/gaf-auth0.interceptor';
import { GafAuth0CallbackModule } from '../../callback/gaf-auth0-callback.module';
import { GafAuth0Service } from '../gaf-auth0-service';

// typescript items
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuthenticationMode, GafStorageManager } from '@gaf/typescript-authentication-general';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    GafAuth0CallbackModule
  ],
  exports: [
  ]
})
export class GafAuth0MobileModule {
  static forRoot(
    config: GafAuth0Settings,
    interceptorConfig?: GafAuth0InterceptorSettings,
    callbacks?: GafAuth0Callbacks
  ): ModuleWithProviders {

    if (config !== undefined) {
      config.mode = GafAuthenticationMode.Parent; // always parent on mobile
    }

    if (interceptorConfig === undefined) {
      interceptorConfig = new GafAuth0InterceptorSettings();
    }

    if (callbacks === undefined) {
      callbacks = {};
    }

    return {
      ngModule: GafAuth0MobileModule,
      providers: [
        { provide: GafAuth0Service, useClass: GafAuth0MobileService},
        GafTokenManagerService,
        { provide: GafStorageManager, useClass: GafAuth0MemoryStorageService},
        GafAuth0CanActivate,
        { provide: HTTP_INTERCEPTORS, useClass: GafAuth0Interceptor, multi: true},
        { provide: 'GafAuth0Settings', useValue: config},
        { provide: 'GafAuth0InterceptorSettings', useValue: interceptorConfig},
        { provide: 'GafAuth0Callbacks', useValue: callbacks}
      ]
    };
  }

  constructor(private authService: GafAuth0Service) {
    // this.authService.renewToken();
  }
}
