import React, { useContext, FC } from 'react';
import { Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { authContext } from '../../contexts/AuthenticationContext';
import { DashboardPage } from '../Dashboard/DashboardPage';
import { LoginPage } from '../Login/LoginPage';
import { RegisterPage } from '../Register/RegisterPage';

export const BasePage = () => {
  const { token } = useContext(authContext);
  if (token) {
    return <Redirect to="/dashboard" />;
  }
  return <Redirect to="/login" />;
};

const UnauthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  const { token } = useContext(authContext);
  if (token === null) {
    return <Route {...routeProps} />;
  }
  return <Redirect to="/" />;
};

const AuthenticatedRoute: React.FC<RouteProps> = ({ children, ...routeProps }) => {
  const {
    token,
    actions: { getTokenData, logout },
  } = useContext(authContext);
  if (token !== null) {
    const tokenData = getTokenData();
    if (tokenData !== null) {
      const { exp } = tokenData;
      if (parseInt(exp, 10) * 1000 > Date.now()) {
        return <Route {...routeProps} />;
      }
      logout();
    }
  }
  return <Redirect to="/" />;
};

const Router: FC = () => {
  return (
    <Switch>
      <UnauthenticatedRoute exact path="/login" component={LoginPage} />

      <UnauthenticatedRoute exact path="/register" component={RegisterPage} />
      <AuthenticatedRoute exact path="/dashboard" component={DashboardPage} />
      <Route path="/" component={BasePage} />
    </Switch>
  );
};
export default Router;
