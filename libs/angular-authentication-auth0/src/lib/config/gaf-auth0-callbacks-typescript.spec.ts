import { TestBed } from "@angular/core/testing";
import { GafAuth0Callbacks } from './gaf-auth0-callbacks';
import { Injector } from '@angular/core';
import { CreateGafAuth0CallbacksTypescript } from './gaf-auth0-callbacks-typescript';

describe('GafAuth0CallbacksTypescript', () => {
  const callbacks: GafAuth0Callbacks = {
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: 'GafAuth0Callbacks', useValue: callbacks }
      ]
    });
  });

  it('should call the failure function', () => {
    let value = 0;
    callbacks.HandleAuthenticationFailure = (injector: Injector) => {
      value = 1;
    }

    callbacks.HandleAuthenticationSuccess = (injector: Injector) => {
      value = 2;
    }

    callbacks.GetScopesKeyFromUrl = (url: string): string => {
      return 'test';
    }

    const result = CreateGafAuth0CallbacksTypescript(callbacks, TestBed.get(Injector));
    result.HandleAuthenticationFailure();
    expect(value).toBe(1);
    result.HandleAuthenticationSuccess();
    expect(value).toBe(2);
    expect(result.GetScopesKeyFromUrl('test')).toBe('test');
  });
});
