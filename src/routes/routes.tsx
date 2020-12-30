import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import StoreProvider from '../components/Store/Provider';
import PrivateRoute from './PrivateRoute';

import ItemDescription from '../pages/ItemDescription';
import Landing from '../pages/Landing';
import ShopList from '../pages/ShopList';
import UserForm from '../pages/UserForm';
import Login from '../pages/Login';
import AddItem from '../pages/AddItem';
import Dashboard from '../pages/Dashboard';

function Routes() {
   
    return (
        <BrowserRouter>
            <StoreProvider>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/:shop_tag" component={ShopList}/>
                    <Route exact path="/user/form" component={UserForm}/>
                    <Route exact path="/:shop_tag/item/:item_id" component={ItemDescription}/>
                    <Route exact path="/user/login" component={Login} />

                    <PrivateRoute path="/item/add" component={AddItem}/>
                    <PrivateRoute path="/dashboard/admin/:page/:item_id?" component={Dashboard} />
                </Switch>
            </StoreProvider>
        </BrowserRouter>
    )
}

export default Routes;