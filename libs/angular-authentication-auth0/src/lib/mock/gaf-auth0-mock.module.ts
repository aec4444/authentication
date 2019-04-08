/* istanbul ignore next */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// app specific stuff
import { GafAuth0CallbackModule } from '../callback/gaf-auth0-callback.module';
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuth0InterceptorSettings } from '../config/gaf-auth0-interceptor-settings';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { GafAuth0MockService } from './gaf-auth0-mock.service';
import { GafTokenManagerService } from '../token-manager/gaf-token-manager.service';
import { GafAuth0CanActivate } from '../gaf-auth0-can-activate/gaf-auth0-can-activate.routeguard';
import { GafAuth0Interceptor } from '../interceptor/gaf-auth0.interceptor';
import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafStorageManagerMockService } from './gaf-storage-manager-mock';
import { GafAuth0Service } from '../service/gaf-auth0-service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    GafAuth0CallbackModule
  ]
})
export class GafAuth0MockModule {
  static forRoot(
    config: GafAuth0Settings,
    interceptorConfig?: GafAuth0InterceptorSettings,
    callbacks?: GafAuth0Callbacks
  ): ModuleWithProviders {

    if (interceptorConfig === undefined) {
      interceptorConfig = new GafAuth0InterceptorSettings();
    }

    if (callbacks === undefined) {
      callbacks = {};
    }

    return {
      ngModule: GafAuth0MockModule,
      providers: [
        { provide: GafAuth0Service, useClass: GafAuth0MockService},
        GafTokenManagerService,
        { provide: GafStorageManager, useClass: GafStorageManagerMockService},
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
