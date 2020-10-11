// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import * as React from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActionCreators from "../../_reducers/User";
import { View, Button, Text } from "react-native";
interface INavigationComponentState {
}

const initialState: INavigationComponentState = {
};

interface INavigationComponentProps {
    history: any;
    isAuthed: boolean;
    isFetching: boolean;
    error: string;
    userLogout: () => void;
    fetchAndHandleAuthentication: (history: any) => void;
}

class NavigationComponent extends React.Component<INavigationComponentProps, INavigationComponentState> {
    static propTypes = {
        isAuthed: PropTypes.bool.isRequired,
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        unauthUser: PropTypes.func.isRequired,
        fetchAndHandleAuthentication: PropTypes.func.isRequired
    }
    constructor(props: INavigationComponentProps) {
        super(props);
        this.state = initialState;
    }
    handleAuth = () => {
        this.props.fetchAndHandleAuthentication(this.props.history);
    }
    handleUnauth = () => {
        this.props.userLogout();
        this.props.history.push("/");
    }
    render() {
        return (
        <View>
            {this.props.isAuthed ? (
               <Button onPress={this.handleUnauth} title="Sign Out" />
            ) : (         
                <View>
                    {!this.props.isFetching ? (
                         <Button onPress={this.handleAuth} title="Sign In" />
                    ) : (
                        <Text>Signing in...</Text>
                    )
                    }
                </View>    
            )
            }

            {this.props.isAuthed ? (
                <Text>Authenticated</Text>
            ) : (
                <Text>Not Authenticated</Text>
            )
            }
        </View>
        )
    }
}

export const Navigation = connect(
    (state: any) => {
        return ({isAuthed: state.auth.isAuthed, isFetching: state.auth.isFetching, error: state.auth.error });
    },
    (dispatch) => bindActionCreators(userActionCreators, dispatch)
)(NavigationComponent);