import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function Routes() {
   
    return (
        <Route>
                    <Route exact path="/" />
                    <Route exact path="/shop/:shop_id" />
                    <Route path="/user-form" />
                    <Route exact path="/shop/:shop_id/item/:item_id"/>
                    <Route path="/login"  />

                    <Route path="/add-item" />
                    <Route path="/dashboard/:page"  />
        </Route>
    )
}

export default Routes;