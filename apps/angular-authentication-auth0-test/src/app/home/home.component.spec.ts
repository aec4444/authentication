import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { DataService } from '../data.service';

import { CUSTOMER_INVENTORY_SEARCH_CONFIG,
         GUARANTEE_REGISTRATION_CONFIG,
         ROOF_PROJECT_CONFIG,
         AUTH0_CONFIG } from '../../environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GafAuth0MockModule } from '@gaf/angular-authentication-auth0';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        GafAuth0MockModule.forRoot(AUTH0_CONFIG)
      ],
      declarations: [
        HomeComponent
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
