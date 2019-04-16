import { TestBed } from '@angular/core/testing';

import { GafWindowLocationService } from './gaf-window-location.service';

describe('GafWindowLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GafWindowLocationService = TestBed.get(GafWindowLocationService);
    expect(service).toBeTruthy();
  });
});
