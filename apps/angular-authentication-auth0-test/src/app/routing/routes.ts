import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { CallbackComponent } from '@gaf/angular-authentication-auth0';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [GafAuth0CanActivate]
  }, {
    path: 'callback',
    component: CallbackComponent
  }, {
    path: '**',
    component: HomeComponent,
    // canActivate: [GafAuth0CanActivate]
  }
];
