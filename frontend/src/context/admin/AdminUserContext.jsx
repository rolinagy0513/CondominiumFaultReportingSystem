
/**
 * @file AdminUserContext.jsx
 * @description
 * React Context for managing the admin-user related states.
 *
 * This context provides states for the admin authentication.
 *
 * ### Responsibilities:
 * - Manages the adminGroupId which stores the admin group's id.
 * - Manages the authenticatedAdminId which stores the admin-user's id.
 * - Manages the authenticatedAdminUserName which stores the admin-user's userName.
 */


import {useState, createContext} from "react";

export const AdminUserContext = createContext();

export const AdminUserProvider = ({ children }) => {

    const [adminGroupId, setAdminGroupId] = useState(() =>
        localStorage.getItem("adminGroupId")
    )

    const [authenticatedAdminId, setAuthenticatedAdminId] = useState(() =>
        localStorage.getItem("authenticatedAdminId")
    );

    const [authenticatedAdminUserName, setAuthenticatedAdminUserName] = useState(() =>
        localStorage.getItem("authenticatedAdminUserName")
    );

    return (
        <AdminUserContext.Provider value={{
            adminGroupId, setAdminGroupId,
            authenticatedAdminId, setAuthenticatedAdminId,
            authenticatedAdminUserName, setAuthenticatedAdminUserName
        }}>
            {children}
        </AdminUserContext.Provider>
    );
};
