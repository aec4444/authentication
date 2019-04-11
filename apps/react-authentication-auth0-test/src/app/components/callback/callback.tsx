import * as React from 'react';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';
import { Redirect } from 'react-router-dom';

export class Callback extends React.Component {
  componentDidMount() {
    GafAuth0Manager.handleAuthentication().then((success: boolean) => {
      if (!success) {
        GafAuth0Manager.login();
      }
    });
  }

  render() {
    if (GafAuth0Manager.isAuthenticated) {
      return (
        <Redirect to='/'></Redirect>
      );
    }

    return null;
  }
}
