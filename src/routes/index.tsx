import { BrowserRouter as Router, Switch } from 'react-router-dom'
import PublicRoute from './components/publicRoute';
import PrivateRoute from './components/privateRoute';

import Error404 from '../pages/Error404'
import SignIn from '../pages/Login';
import { Button } from '@material-ui/core';
import { useAuth } from '../contexts/auth'
import Register from '../pages/Register';

const Routes = () => {
  const auth = useAuth()
  const Autenticado = () => {
    return (
      <div><Button onClick={logout}>Logout</Button></div>
    )
  }

  const logout = () => {
    auth.logout()
  }

  return (
    <Router>
      <Switch>
        <PublicRoute restricted exact path='/' component={SignIn} />
        <PublicRoute restricted path='/register' component={Register} />
        <PrivateRoute path='/app' component={() => <Autenticado />} />
        <PublicRoute component={Error404} />
      </Switch>
    </Router>
  )
}
export default Routes