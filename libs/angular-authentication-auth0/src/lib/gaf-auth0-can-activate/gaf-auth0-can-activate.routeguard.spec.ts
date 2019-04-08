import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GafAuth0CanActivate } from './gaf-auth0-can-activate.routeguard';
import { CallbackComponent } from '../callback/callback.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GafTokenManagerService } from '../token-manager/gaf-token-manager.service';
import { GafAuth0Interceptor } from '../interceptor/gaf-auth0.interceptor';
import { GafAuth0MockService } from '../mock/gaf-auth0-mock.service';
import { GafStorageManagerMockService } from '../mock/gaf-storage-manager-mock';
import { GafAuth0Service } from '../service/gaf-auth0-service';

// typescript
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafStorageManager } from '@gaf/typescript-authentication-general';

const config: GafAuth0Settings = {
  audience: 'audience',
  clientId: 'clientId',
  domain: 'domain',
  loginUri: 'https://login.com'
};

describe('GafAuth0CanActivate', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [
      CallbackComponent
    ],
    imports: [
      RouterTestingModule
    ],
    providers: [
      { provide: GafAuth0Service, useClass: GafAuth0MockService},
      GafTokenManagerService,
      { provide: GafStorageManager, useClass: GafStorageManagerMockService},
      { provide: HTTP_INTERCEPTORS, useClass: GafAuth0Interceptor, multi: true},
      { provide: 'GafAuth0Settings', useValue: config},
      { provide: 'GafAuth0InterceptorSettings', useValue: undefined},
      { provide: 'GafAuth0Callbacks', useValue: {}}
    ]
  }));

  it('should be created', () => {
    const service: GafAuth0CanActivate = TestBed.get(GafAuth0CanActivate);
    expect(service).toBeTruthy();
  });

  it('should activate via login', () => {
    const svc = TestBed.get(GafAuth0Service);
    const guard: GafAuth0CanActivate = TestBed.get(GafAuth0CanActivate);

    expect(guard.canActivate(undefined, undefined)).toBeTruthy();
  });


  it('should activate already logged in', () => {
    const svc = TestBed.get(GafAuth0Service);
    svc.login();
    const guard: GafAuth0CanActivate = TestBed.get(GafAuth0CanActivate);

    expect(guard.canActivate(undefined, undefined)).toBeTruthy();
  });
});
