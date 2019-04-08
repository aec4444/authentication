import { TestBed } from '@angular/core/testing';

import { GafTokenManagerService } from './gaf-token-manager.service';

describe('GafTokenManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GafTokenManagerService
    ]
  }));

  it('should be created', () => {
    const service: GafTokenManagerService = TestBed.get(GafTokenManagerService);
    expect(service).toBeTruthy();
  });
});
