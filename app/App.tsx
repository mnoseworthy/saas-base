import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { history } from './_helpers';
import { Login } from './LoginPage';
import { Home } from './HomePage';
import { AppRoute, NotFound } from './_components';
import { store } from "./_helpers"
import { Provider }  from 'react-redux';
import * as Expo from 'expo';
import * as config from './_configuration';
import { Linking } from 'react-native';

export default class App extends React.Component {
  constructor(props : any) {
    super(props);

    //history.listen((location, action) => {
        // clear alert on location change
        //dispatch(alertActions.clear());
    //});
  }

  render() {
    return (
      <Provider store={store}>
          <Router history={history}>
            <Switch>
                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <AppRoute path="/home" component={Home} checkAuthentication={false} />
                <AppRoute path="/login" component={Login} checkAuthentication={false} />
                <Route path='/facebook_login' component={() => { 
                    Linking.canOpenURL(config.SERVER_ROOT_URL+'/auth/facebook').then(supported => {
                      if (supported) {
                        Linking.openURL(config.SERVER_ROOT_URL+'/auth/facebook');
                      } else {
                        console.log("Don't know how to open URI: " + config.SERVER_ROOT_URL+'/auth/facebook');
                      }
                    });
                    return null;
                }}/>
                <AppRoute path="*" component={NotFound} checkAuthentication={false} />
            </Switch>
          </Router>
      </Provider>
    )
  };
}

Expo.registerRootComponent(App);
