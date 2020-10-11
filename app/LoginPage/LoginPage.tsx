import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as PropTypes from "prop-types";
import {
    StyleSheet,
    Text,
    View
  } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as userActionCreators from "../_reducers/User";

interface ILoginComponentState {
}
const initialState: ILoginComponentState = {
};

interface ILoginComponentProps {
  history: any;
  isAuthed: boolean;
  isFetching: boolean;
  error: string;
  fetchAndHandleAuthentication: (history: any) => void;
  fetchingUser: () => void;
}

class LoginComponent extends React.Component<ILoginComponentProps,ILoginComponentState> {
  static propTypes = {
    isAuthed: PropTypes.bool,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
    fetchAndHandleAuthentication: PropTypes.func.isRequired,
    fetchingUser: PropTypes.func.isRequired
  }
  constructor(props : any) {
    super(props);      
    this.state = initialState;
  }

  // Handle Login with Facebook button tap
  loginWithFacebook = () => { 
    this.props.history.push('/facebook_login');
  }

  render() {
      
      return (
        <View>
            {!this.props.isAuthed ? (
              <View style={styles.buttons}>
                  <Icon.Button
                    name="facebook"
                    backgroundColor="#3b5998"
                    onPress={this.loginWithFacebook}
                    {...iconStyles}
                  >
                  Login with Facebook
                  </Icon.Button>
              </View>
              ) : (
                <Text>Welcome to Home!</Text>
              )
            }
        </View>
      );
  }
}

export const Login = connect(
  (state: any) => {
    return ({ isFetching: state.auth.isFetching, error: state.auth.error, isAuthed: state.auth.isAuthed });
  },
  (dispatch) => bindActionCreators(userActionCreators, dispatch)
)(LoginComponent);

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});



