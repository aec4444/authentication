import * as React from 'react';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';

export const HomeLoggedIn = () => (
  <React.Fragment>
    You are logged in as {GafAuth0Manager.storage.info.profile.email}
  </React.Fragment>
);
