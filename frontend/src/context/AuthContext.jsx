/**
 * @file AuthContext.jsx
 * @description
 * React Context for managing authentication-related states throughout the application.
 *
 * This context provides shared state for user authentication and registration.
 *
 * ### Responsibilities:
 * - Maintains the `registerFormData` state to store user input during registration.
 * - Manages the `loginFormData` state to hold credentials entered during login.
 *
 * ## Usage
 * Wrap your root component with `<AuthProvider>` and use `useContext(AuthContext)` inside
 * any nested component to access authentication data and update functions.
 */


import {useState, createContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [registerFormData, setRegisterFormData] = useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword:'',
    });
    const [loginFormData, setLoginFormData] = useState({
        email:'',
        password:'',
    });


    return (
        <AuthContext.Provider value={{
            registerFormData, setRegisterFormData,
            loginFormData, setLoginFormData,
        }}>
            {children}
        </AuthContext.Provider>
    );
};