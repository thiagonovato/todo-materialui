import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../../contexts/auth'

interface Props extends RouteProps {
  // tslint:disable-next-line:no-any
  component: any;
  restricted?: boolean;
}

const PublicRoute: React.FC<Props> = ({ component: Component, restricted = false, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={routeProps =>
        isAuthenticated && restricted ? (
          <Redirect to="/app" />
        ) : (
          <Component {...routeProps} />
        )
      }
    />
  );
};

export default PublicRoute;
