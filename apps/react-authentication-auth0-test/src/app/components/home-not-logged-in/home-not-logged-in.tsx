import * as React from 'react';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';

export class HomeNotLoggedIn extends React.Component {
  login = () => GafAuth0Manager.login();

  render() {
    return (
      <React.Fragment>
        You are not logged in.
        <button className="btn btn-default ml-2" onClick={evt => this.login()}>Login</button>
      </React.Fragment>
    );
  }
}
