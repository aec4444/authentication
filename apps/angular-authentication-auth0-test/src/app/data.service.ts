import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GafAuth0Service } from '@gaf/angular-authentication-auth0';
import { Observable } from 'rxjs';
import { Customer } from './models/customers';
import { CustomerSearchModuleConfig } from './models/customer-search-config';
import { DataWithCount } from './models/data-with-count';
import { ResponseWithCount } from './models/response-with-count';
import { map, catchError } from 'rxjs/operators';
import { GuaranteeRegistrationLookup, GuaranteeRegistrationLookupEntry } from './models/guarantee-registration';
import { RoofProjectConfig } from './models/roof-project-config';
import { RoofProject } from './models/roof-project';
import { TeamNestJsConfig } from './models/team-nestJs-config';
import { Team } from './models/team';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _lastSearch: { pageNumber: number, params: Customer | string, url?: string, advanced: boolean };

  constructor(
    private http: HttpClient,
    private auth: GafAuth0Service,
    @Inject('CustomerSearchModuleConfig') public configCustomerSearch: CustomerSearchModuleConfig,
    @Inject('GuaranteeRegistrationConfig') public configGuaranteeRegistration: CustomerSearchModuleConfig,
    @Inject('RoofProjectConfig') public configRoofProject: RoofProjectConfig,
    @Inject('TeamNestJsConfig') public configTeamNestJs: TeamNestJsConfig
  ) { }

  /**
   * Get the email address or the emulated address
   */
  getEmail() {
    if (this.configCustomerSearch.emulate !== undefined &&
      this.configCustomerSearch.emulate !== null
      && this.configCustomerSearch.emulate !== '') {
      return this.configCustomerSearch.emulate;
    }
    return this.auth.storage.info.profile.email;
  }

  /**
   * Search customers by string
   * @param searchString String to use in the search
   */
  customerSearch(searchString: string): Observable<DataWithCount<Customer>> {
    const email = this.getEmail();
    const url = `${this.configCustomerSearch.baseUrl}/SalesPersonCustomerList/${email}`;

    // save the last search params
    this._lastSearch = {
      params: searchString,
      pageNumber: 1,
      url: url,
      advanced: false
    };

    const params = this.getHttpParamsFromLastSearch();

    return this.http
      .get<ResponseWithCount<Customer>>(url, { params: params })
      .pipe(
        map(res => {
          if (res.isSuccess) {
            return new DataWithCount<Customer>(res.item, res.count);
          } else {
            throw new Error(res.errorMessage);
          }
        })
      );
  }

  customerSearchAdvanced(searchCustomer: Customer): Observable<DataWithCount<Customer>> {
    const url = `${this.configCustomerSearch.baseUrl}/SalesPersonCustomerListAdvanced/${this.getEmail()}`;

    // save the last search params
    this._lastSearch = {
      pageNumber: 1,
      params: searchCustomer,
      url: url,
      advanced: true
    };

    const params = this.getHttpParamsFromLastSearch();

    return this.http
      .get<ResponseWithCount<Customer>>(url, { params: params })
      .pipe(
        map(res => {
          if (res.isSuccess) {
            return new DataWithCount<Customer>(res.item, res.count);
          } else {
            throw new Error(res.errorMessage);
          }
        })
      );
  }

  private getHttpParamsFromLastSearch(): HttpParams {
    let params = new HttpParams();

    if (this._lastSearch.advanced) {
      const searchCustomer = <Customer>this._lastSearch.params;

      params = this.addSearchCriteria(params, 'customerID', searchCustomer.customerID);
      params = this.addSearchCriteria(params, 'customerName', searchCustomer.customerName);
      params = this.addSearchCriteria(params, 'shipToAddress1', searchCustomer.shipToAddress1);
      params = this.addSearchCriteria(params, 'city', searchCustomer.city);
      params = this.addSearchCriteria(params, 'state', searchCustomer.state);
      params = this.addSearchCriteria(params, 'postal', searchCustomer.postal);
    } else {
      const searchString = <string>this._lastSearch.params;
      if (searchString !== undefined && searchString !== null && searchString !== '') {
        params = params.append('filter', searchString);
      }
    }

    params = params.append('pageSize', this.configCustomerSearch.pageSize.toString());
    params = params.append('pageNum', this._lastSearch.pageNumber.toString());

    return params;
  }

  /**
   * Get the next page of data
   */
  customerSearchNextPage(): Observable<DataWithCount<Customer>> {
    this._lastSearch.pageNumber++;

    const params = this.getHttpParamsFromLastSearch();

    return this.http
      .get<ResponseWithCount<Customer>>(this._lastSearch.url, { params: params })
      .pipe(
        map(res => {
          if (res.isSuccess) {
            return new DataWithCount<Customer>(res.item, res.count);
          } else {
            throw new Error(res.errorMessage);
          }
        })
      );
  }

  get isLastSearchAdvanced(): boolean {
    return (this._lastSearch !== undefined) && (this._lastSearch.advanced);
  }

  private addSearchCriteria(params: HttpParams, name: string, value: string): HttpParams {
    if (value !== undefined && value !== null && value !== '') {
      return params.append(name, value);
    }

    return params;
  }

  public lookupValues(formType: string, lookupName: string): Observable<DataWithCount<GuaranteeRegistrationLookupEntry>> {
    // construct the url
    const url = `${this.configGuaranteeRegistration.baseUrl}/${formType}/${lookupName}`;

    return this.http
      .get<GuaranteeRegistrationLookup>(url)
      .pipe(
        map(res => {
          return new DataWithCount<GuaranteeRegistrationLookupEntry>(res.entries, res.entries.length);
        })
      );
  }

  public getRoofProjects(): Observable<DataWithCount<RoofProject>> {
    const url = `${this.configRoofProject.baseUrl}/RoofProject/GetRoofProjectsbySearchCriteria`;

    const body = {
      Contractor: this.getEmail(),
      'Content': {
        'Skip': 0,
        'PageSize': 10,
        'ProjectType': [1, 2],
        'Status': [1, 3, 0, 2, 4],
        'Priority': [3, 2, 1],
        'IsShowCase': null,
        'SearchText': null,
        'SearchDate': null,
        'ImageSize': 'medium',
        'SortType': 0,
        'SortAscending': false
      }
    };

    return this.http
      .post<RoofProject[]>(url, body)
      .pipe(
        map(res => {
          return new DataWithCount<RoofProject>(res, res.length);
        })
      );
  }

  public getTeams(): Observable<DataWithCount<Team>> {
    const url = `${this.configTeamNestJs.baseUrl}/teams`;

    return this.http
    .get<Team[]>(url)
    .pipe(
      map(res => {
        return new DataWithCount<Team>(res, res.length);
      })
    );
  }

  public saveTeam(team: Team): Observable<Team> {
    const url = `${this.configTeamNestJs.baseUrl}/teams`;

    // set to 0 so it can be assigned
    if (team.id === undefined || team.id === null) {
      team.id = 0;
    }

    return this.http.post<Team>(url, team);
  }
}
