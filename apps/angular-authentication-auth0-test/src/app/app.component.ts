import { Component, OnInit } from '@angular/core';
import { GafAuth0Service } from '@gaf/angular-authentication-auth0';

@Component({
  selector: 'gaf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-authentication-auth0-app';

  constructor(private authService: GafAuth0Service) {
    // if (!authService.isAuthenticated) {
    //   if (authService.config.mode === GafAuthenticationMode.Parent) {
    //     authService.login();
    //   }
    // }
  }


}
