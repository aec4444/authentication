import { TestBed } from '@angular/core/testing';

import { GafAuth0BrowserStorageService } from './gaf-auth0-browser-storage.service';

describe('GafAuth0StorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GafAuth0BrowserStorageService = TestBed.get(GafAuth0BrowserStorageService);
    expect(service).toBeTruthy();
  });
});
