import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector } from '@angular/core';

import { CallbackComponent } from './callback.component';
import { GafTokenManagerService } from '../token-manager/gaf-token-manager.service';
import { GafAuth0Interceptor } from '../interceptor/gaf-auth0.interceptor';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { GafAuth0MockService } from '../mock/gaf-auth0-mock.service';
import { GafStorageManagerMockService } from '../mock/gaf-storage-manager-mock';
import { GafAuth0Service } from '../service/gaf-auth0-service';

// typescript lib
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafStorageManager } from '@gaf/typescript-authentication-general';



const createModule = () => {
  const config: GafAuth0Settings = {
    audience: 'audience',
    clientId: 'clientId',
    domain: 'domain',
    loginUri: 'https://login.com'
  };

  const callbacks: GafAuth0Callbacks = {
    HandleAuthenticationFailure: (injector: Injector) => {
      console.log('Handling Failure');
    },
    HandleAuthenticationSuccess: (injector: Injector) => {
      console.log('Handling Success');
    }
  };

  TestBed.configureTestingModule({
    declarations: [ CallbackComponent ],
    providers: [
      { provide: GafAuth0Service, useClass: GafAuth0MockService},
      GafTokenManagerService,
      { provide: GafStorageManager, useClass: GafStorageManagerMockService},
      { provide: HTTP_INTERCEPTORS, useClass: GafAuth0Interceptor, multi: true},
      { provide: 'GafAuth0Settings', useValue: config},
      { provide: 'GafAuth0InterceptorSettings', useValue: undefined},
      { provide: 'GafAuth0Callbacks', useValue: callbacks}
    ]
  })
  .compileComponents();
};

describe('CallbackComponent', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let svc: GafAuth0Service;

  beforeEach(async(() => {
    createModule();
  }));

  beforeEach(() => {
    svc = TestBed.get(GafAuth0Service);
    svc.login();
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle authentication successfully', () => {
    spyOn(console, 'log').and.callFake((msg) => {
      expect(msg).toBe('Handling Success');
    });
    component.ngOnInit();
  });
});

describe('CallbackComponent w/ logout', () => {
  let component: CallbackComponent;
  let fixture: ComponentFixture<CallbackComponent>;
  let svc: GafAuth0Service;

  beforeEach(async(() => {
    createModule();
  }));

  beforeEach(() => {
    svc = TestBed.get(GafAuth0Service);
    svc.logout();
    fixture = TestBed.createComponent(CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle authentication failure', () => {
    spyOn(console, 'log').and.callFake((msg) => {
      expect(msg).toBe('Handling Failure');
    });
    component.ngOnInit();
  });
});
