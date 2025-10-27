/**
 * @file UserContext.jsx
 * @description
 * React Context for managing user related states through the application.
 *
 * This context provides shared state for user data.
 *
 * ### Responsibilities:
 * - Maintains the `authenticatedUserId` state to store the current user's id.
 * - Manages the `authenticatedUserName` state to store the current user's userName.
 */


import {useState, createContext, useEffect} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [authenticatedUserId, setAuthenticatedUserId] = useState(() =>
        localStorage.getItem("authenticatedUserId")
    );

    const [authenticatedUserName, setAuthenticatedUserName] = useState(() =>
        localStorage.getItem("authenticatedUserName")
    );

    useEffect(() => {
        if (authenticatedUserId) {
            localStorage.setItem("authenticatedUserId", authenticatedUserId);
        } else {
            localStorage.removeItem("authenticatedUserId");
        }
    }, [authenticatedUserId]);

    useEffect(() => {
        if (authenticatedUserName) {
            localStorage.setItem("authenticatedUserName", authenticatedUserName);
        } else {
            localStorage.removeItem("authenticatedUserName");
        }
    }, [authenticatedUserName]);

    return (
        <UserContext.Provider value={{
            authenticatedUserId, setAuthenticatedUserId,
            authenticatedUserName, setAuthenticatedUserName,
        }}>
            {children}
        </UserContext.Provider>
    );
};