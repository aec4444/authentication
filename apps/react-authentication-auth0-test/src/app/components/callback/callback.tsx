import * as React from 'react';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';

export class Callback extends React.Component {
  componentDidMount() {
    GafAuth0Manager.handleAuthentication().then((success: boolean) => {
      if (success) {
        this.context.router.push('/');
      } else {
        GafAuth0Manager.login();
      }
    });
  }

  render() {
    return null;
  }
}
