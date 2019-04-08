import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GafAuth0MockModule } from '@gaf/angular-authentication-auth0';

import { AppComponent } from './app.component';
import { routes } from './routing/routes';
import { customInterceptor } from './config/custom-interceptor';
import { CustomAuth0Callbacks } from './config/auth0-callbacks';
import { AUTH0_CONFIG } from '../environments/environment';
import { HomeComponent } from './home/home.component';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent
      ],
      providers: [

      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        BrowserModule,
        GafAuth0MockModule.forRoot(AUTH0_CONFIG),
        HttpClientTestingModule,
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-authentication-auth0-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('angular-authentication-auth0-app');
  });
});
