import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GafAuth0Service } from '../service/gaf-auth0-service';

@Injectable({
  providedIn: 'root'
})
export class GafAuth0CanActivate implements CanActivate {

  constructor(private auth: GafAuth0Service) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
      if (!this.auth.isAuthenticated) {
        this.auth.login();
      }
      return this.auth.isAuthenticated;
  }
}
