import { BrowserRouter as Router, Switch } from 'react-router-dom'
import PublicRoute from './components/publicRoute';
import PrivateRoute from './components/privateRoute';

import Error404 from '../pages/Error404'
import SignIn from '../pages/Login';
import Register from '../pages/Register';
import Main from '../pages/Main';
import List from '../pages/List';
import NewListPage from '../pages/Newlist';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <PublicRoute restricted exact path='/' component={SignIn} />
        <PublicRoute restricted path='/register' component={Register} />
        <PrivateRoute exact path='/app' component={Main} />
        <PrivateRoute exact path='/app/:newList' component={NewListPage} />
        <PublicRoute path='/app/:idUser/:idList' component={List} />
        <PublicRoute component={Error404} />
      </Switch>
    </Router>
  )
}
export default Routes