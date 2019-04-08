import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CUSTOMER_INVENTORY_SEARCH_CONFIG,
         GUARANTEE_REGISTRATION_CONFIG,
         ROOF_PROJECT_CONFIG,
         AUTH0_CONFIG } from '../environments/environment';
import { GafAuth0MockModule } from '@gaf/angular-authentication-auth0';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      GafAuth0MockModule.forRoot(AUTH0_CONFIG)
    ],
    providers: [
      DataService,
      {
        provide: 'CustomerSearchModuleConfig',
        useValue: CUSTOMER_INVENTORY_SEARCH_CONFIG
      },
      {
        provide: 'GuaranteeRegistrationConfig',
        useValue: GUARANTEE_REGISTRATION_CONFIG
      },
      {
        provide: 'RoofProjectConfig',
        useValue: ROOF_PROJECT_CONFIG
      }
    ]
  }));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });
});
