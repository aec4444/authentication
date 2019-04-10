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
    callbacks.GetScopesKeyFromUrl = (url: string): string => {
      return 'test';
    }

    const result = CreateGafAuth0CallbacksTypescript(callbacks);
    expect(result.GetScopesKeyFromUrl('test')).toBe('test');
  });
});
