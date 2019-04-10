import * as React from 'react';
import { HomeLoggedIn } from '../home-logged-in/home-logged-in';
import { HomeNotLoggedIn } from '../home-not-logged-in/home-not-logged-in';
import { GafAuth0Manager } from '../../auth/gaf-auth0-manager';

export const Home = () => {
  let loggedIn;
  if (GafAuth0Manager.isAuthenticated) {
    loggedIn = <HomeLoggedIn></HomeLoggedIn>;
  } else {
    loggedIn = <HomeNotLoggedIn></HomeNotLoggedIn>;
  }

  return (
    <React.Fragment>
      <div className="container">
        {loggedIn}
      </div>
    </React.Fragment>
  );
};
