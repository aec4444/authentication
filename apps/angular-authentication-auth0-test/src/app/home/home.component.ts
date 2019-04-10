import { Component, OnInit, Inject } from '@angular/core';
import { DataWithCount } from '../models/data-with-count';
import { Customer } from '../models/customers';
import { GuaranteeRegistrationLookupEntry } from '../models/guarantee-registration';
import { RoofProject } from '../models/roof-project';
import { DataService } from '../data.service';
import { ApplicationConfig } from '../models/app-config';
import { GafAuth0Service } from '@gaf/angular-authentication-auth0';


@Component({
  selector: 'gaf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  customerInventoryData: DataWithCount<Customer>;
  roofProjectData: DataWithCount<RoofProject>;
  useNestInterface = false;

  constructor(
    public authService: GafAuth0Service,
    private data: DataService,
    @Inject('ApplicationConfig') private config: ApplicationConfig) {

    this.useNestInterface = config.useNestJs;
    this.authService.onAuthenticationChanged.subscribe(loggedIn => {
      console.log(`Logged In: ${loggedIn}`);

      if (loggedIn) {
        this.refreshData();
      }
    });
  }

  refreshData() {
    if (!this.useNestInterface) {
      this.queryCustomerInventory();
      // this.queryRoofProjects();
    }
  }

  ngOnInit() {
    if (this.authService.isAuthenticated) {
      this.refreshData();
    }
  }

  queryCustomerInventory() {
    this.data.customerSearch('').subscribe(data => {
      this.customerInventoryData = data;
    });
  }

  getPage() {
    this.data.customerSearchNextPage().subscribe(data => {
      this.customerInventoryData = data;
    });
  }

  // queryRoofProjects() {
  //   this.data.getRoofProjects().subscribe(data => {
  //     this.roofProjectData = data;
  //   });
  // }

  logout() {
    this.authService.logout();
  }

  login() {
    this.authService.login();
  }
}
