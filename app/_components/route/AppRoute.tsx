import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Navigation, Footer } from "../";
import * as userActionCreators from "../../_reducers/User";
import { View } from "react-native" 

interface IMainContainerProps {
  component: any;
  isAuthed: boolean;
  path?: string;
  exact?: boolean;
  checkAuthentication: boolean;
}

const MainContainer: React.StatelessComponent<IMainContainerProps> = (props) => {
  const { component: Component, ...rest } = props;
  return <Route {...rest} render={matchProps =>
    (props.checkAuthentication && !props.isAuthed) ?
      (
        <Redirect to="/login" />
      ) :
      (
        <View>
          <Navigation history={matchProps.history} />
          <Component {...matchProps} />
          <Footer />
        </View>
      )
  } />
}

export const AppRoute = connect(
  (state: any) => {
    return ({ isAuthed: state.isAuthed });
  },
  (dispatch) => bindActionCreators(userActionCreators, dispatch)
)(MainContainer);