import { TestBed } from '@angular/core/testing';

import { GafAuth0MemoryStorageService } from './gaf-auth0-memory-storage.service';

describe('GafAuth0MemoryStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GafAuth0MemoryStorageService = TestBed.get(GafAuth0MemoryStorageService);
    expect(service).toBeTruthy();
  });
});
