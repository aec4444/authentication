import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GafAuth0BrowserModule } from '@gaf/angular-authentication-auth0';

import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { CustomAuth0Callbacks } from './config/auth0-callbacks';
import { customInterceptor } from './config/custom-interceptor';
import { AppRoutingModule } from './routing/app-routing.module';
import { HomeComponent } from './home/home.component';
import { TeamListComponent } from './team/team-list/team-list.component';
import { TeamAddEditComponent } from './team/team-add-edit/team-add-edit.component';

import { AUTH0_CONFIG, CUSTOMER_INVENTORY_SEARCH_CONFIG,
  GUARANTEE_REGISTRATION_CONFIG,
  ROOF_PROJECT_CONFIG,
  TEAM_NESTJS_CONFIG,
  environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TeamListComponent,
    TeamAddEditComponent
  ],
  imports: [
    BrowserModule,
    GafAuth0BrowserModule.forRoot(AUTH0_CONFIG, customInterceptor, CustomAuth0Callbacks),
    HttpClientModule,
    AppRoutingModule,
    FormsModule
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
    },
    {
      provide: 'TeamNestJsConfig',
      useValue: TEAM_NESTJS_CONFIG
    },
    {
      provide: 'ApplicationConfig',
      useValue: environment
    }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [HomeComponent]
})
export class AppModule { }
