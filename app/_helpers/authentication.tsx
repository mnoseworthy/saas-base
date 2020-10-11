import { User } from "../_models/User";
import * as config from '../_configuration';

export const authenticate = () => {
  return new Promise<User>((resolve, reject) => {
    fetch(config.SERVER_ROOT_URL+"/auth/login/success", {
      method: "GET",
      mode:'cors',
      redirect: 'follow',
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true"
      }
    }).then(response => {
      return response.json();
    }).then(body => {
      let U : User = new User();
      U.email = body.user.email;
      U.firstName = body.user.email;
      U.lastName = body.user.email;
      U.uid = body.user.uuid;
      resolve(U);
    }).catch(error => {
      console.log(error)
      reject("Failed to authenticate user")
    });
  });
}

export const unauthenticate = () => {
  return new Promise((resolve, reject) => {
    fetch(config.SERVER_ROOT_URL+"/auth/logout", {
      method: "GET",
      credentials: "include",
      mode: 'no-cors',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true"
      }
    }).then(response => {
    if (response.status === 200 || response.status === 302) return response.json();
      reject("failed to unauthenticate user");
    }).then(body => {
      resolve(body);
    }).catch(error => {
      reject("Failed to unauthenticate user")
    });
  });
}

export const checkIfAuthenticated = (store: any) => {return store.getState().isAuthed}