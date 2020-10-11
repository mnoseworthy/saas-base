import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActionCreators from "../_reducers/User";
import {View, Button, Text} from "react-native";

interface IHomeComponentState {
}

const initialState: IHomeComponentState = {
};

interface IHomeComponentProps {
  history: any;
  isAuthed: boolean;
  isFetching: boolean;
  error: string;
  fetchAndHandleAuthentication: (history: any) => void;
}

class HomeComponent extends React.Component<IHomeComponentProps, IHomeComponentState> {
  static propTypes = {
    isAuthed: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    fetchAndHandleAuthentication: PropTypes.func.isRequired
  }
  constructor(props: IHomeComponentProps) {
    super(props);
    this.state = initialState;
  }
  handleAuth = () => {
    this.props.fetchAndHandleAuthentication(this.props.history);
  }
  componentDidMount(){
    this.props.fetchAndHandleAuthentication(this.props.history);
  }
  render() {
    return (
     <View>
            {!this.props.isAuthed ? (
                <Button title="Sign In" onPress={this.handleAuth} />
              ) : (
                <Text>Welcome Home!</Text>
              )
            }
            {this.props.isFetching ? (
                <Text>Signing in...</Text>
              ) : (
                <Text>Not Signing in</Text>
              )
            }
     </View>
    )
  }
}

export const Home = connect(
  (state: any) => {
    return ({ isFetching: state.auth.isFetching, error: state.auth.error, isAuthed: state.auth.isAuthed });
  },
  (dispatch) => bindActionCreators(userActionCreators, dispatch)
)(HomeComponent);