import React, { createContext, useState } from "react";
import { postRoute } from "../helpers/apiFetcher";
import { initialState } from "./InitialState";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  let [state, setState] = useState(initialState);

  const submitRegistrationForm = (data, e) => {
    e.preventDefault();

    const newUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
    };

    postRoute("/register", newUser)
      .then((results) =>
        setState({ ...state, redirectLogin: true, message: results.message })
      )
      .catch((postError) =>
        console.error(`Error when running POST to api: ${postError}`)
      );
  };

  const submitLoginForm = (data, e) => {
    e.preventDefault();

    const user = {
      email: data.email,
      password: data.password,
    };

    postRoute("/login", user)
      .then((results) => {
        setState({
          ...state,
          user: results.securedFinalUser,
          token: results.token,
          redirectProfile: true,
        });
      })
      .catch((postError) =>
        console.error(`Error when running POST to api: ${postError}`)
      );
  };

  const authenticateUser = (isTokenVerified) => {
    setState({
      ...state,
      isAuthenticated: isTokenVerified,
      message: "You've successfully logged into your profile!",
    });
  };

  const logoutUser = () => state = initialState

  return (
    <AuthContext.Provider
      value={{
        ...state,
        submitRegistrationForm: submitRegistrationForm,
        submitLoginForm: submitLoginForm,
        authenticateUser: authenticateUser,
        logoutUser: logoutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthContextProvider;
