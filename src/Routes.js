import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import Product from './pages/Product';
import Station from './pages/Station';
import StationDetail from './pages/StationDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Account from './pages/Account';
import ProductEdit from './pages/ProductEdit';
import StationEdit from './pages/StationEdit';
import NotFound from './pages/NotFound';
import {auth} from './utils/Auth';

const PrivateRoute = ({ component: Component, ...rest}) => (
    <Route {...rest} render={props => (
        auth() ? (<Component {...props}/>) : (<Redirect to={{ pathname:'/', state:{from:props.location} }} />)
    )} />
)

const Routes = () => {
    return(
        <BrowserRouter>
            <Header />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/materiais' component={Product} />
                <Route exact path='/postos' component={Station} />
                <Route path='/postos/:id' component={StationDetail} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/conta' component={Account} />
                <PrivateRoute exact path='/cadastrar' component={Register} />
                <PrivateRoute exact path='/admin' component={Admin} />
                <PrivateRoute path='/editarmateriais/:id' component={ProductEdit} />
                <PrivateRoute path='/editarposto/:id' component={StationEdit} />
                <Route path='*' component={NotFound} />
            </Switch>
        </BrowserRouter>
    )
}
export default Routes;
