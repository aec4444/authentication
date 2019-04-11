import * as React from 'react';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';
import CustomerInventoryContainer from '../../customer-inventory/customer-inventory-container/customer-inventory-container';

export class HomeLoggedIn extends React.Component {
  logout = () => {
    GafAuth0Manager.logout();
  }

  render() {
    return (
      <React.Fragment>
        You are logged in as {GafAuth0Manager.storage.info.profile.email}
        <button className="btn btn-default ml-2" onClick={evt => this.logout()}>Logout</button>

        <CustomerInventoryContainer></CustomerInventoryContainer>
      </React.Fragment>
    )
  }
}
