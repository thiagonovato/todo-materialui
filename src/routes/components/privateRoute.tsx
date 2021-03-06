import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

interface Props extends RouteProps {
  component: any;
}
const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <Route
      {...rest}
      render={routeProps =>
        isAuthenticated ? (
          <Component {...routeProps} />
        ) : (
          !loading &&
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
