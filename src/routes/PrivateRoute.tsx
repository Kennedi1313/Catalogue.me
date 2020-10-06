import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import StoreContext from '../components/Store/Context'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { token } = useContext(StoreContext);
    return(
        <Route
            { ...rest }
            render = { props => 
                token 
                ? (
                    <Component { ...props } />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    );
}

export default PrivateRoute;