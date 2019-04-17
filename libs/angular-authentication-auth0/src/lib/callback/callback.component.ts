import { Component, OnInit, Injector, Inject } from '@angular/core';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { GafAuth0Service } from '../service/gaf-auth0-service';

@Component({
  selector: 'gaf-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    public authService: GafAuth0Service,
    private injector: Injector,
    @Inject('GafAuth0Callbacks') private configMethods: GafAuth0Callbacks
  ) { }

  ngOnInit() {
    // handle callback from auth0
    this.authService.handleAuthentication().then((success: boolean) => {
      if (this.configMethods !== null) {
        if (success) {
          if (typeof this.configMethods.handleAuthenticationSuccess === 'function') {
            this.configMethods.handleAuthenticationSuccess(this.injector);
          }
        } else {
          if (typeof this.configMethods.handleAuthenticationFailure === 'function') {
            this.configMethods.handleAuthenticationFailure(this.injector);
          }
        }
      }
    });
  }

}
