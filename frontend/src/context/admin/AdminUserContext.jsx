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

import {useState, createContext, useEffect} from "react";

export const AdminUserContext = createContext();

export const AdminUserProvider = ({ children }) => {

    const [adminGroupId, setAdminGroupId] = useState(() => {
        const storedId = localStorage.getItem("adminGroupId");
        console.log('🔍 [ADMIN_CONTEXT] Initial adminGroupId from localStorage:', storedId);
        return storedId;
    });

    const [authenticatedAdminId, setAuthenticatedAdminId] = useState(() => {
        const storedId = localStorage.getItem("authenticatedAdminId");
        console.log('🔍 [ADMIN_CONTEXT] Initial authenticatedAdminId from localStorage:', storedId);
        return storedId;
    });

    const [authenticatedAdminUserName, setAuthenticatedAdminUserName] = useState(() => {
        const storedName = localStorage.getItem("authenticatedAdminUserName");
        console.log('🔍 [ADMIN_CONTEXT] Initial authenticatedAdminUserName from localStorage:', storedName);
        return storedName;
    });

    // Sync adminGroupId with localStorage
    useEffect(() => {
        console.log('🔄 [ADMIN_CONTEXT] adminGroupId changed to:', adminGroupId);

        if (adminGroupId) {
            console.log('✅ [ADMIN_CONTEXT] Setting adminGroupId in localStorage:', adminGroupId);
            localStorage.setItem("adminGroupId", adminGroupId);
        } else {
            console.log('🧹 [ADMIN_CONTEXT] Clearing adminGroupId from localStorage');
            localStorage.removeItem("adminGroupId");
        }

        console.log('📊 [ADMIN_CONTEXT] Current localStorage adminGroupId:',
            localStorage.getItem("adminGroupId"));
    }, [adminGroupId]);

    // Sync authenticatedAdminId with localStorage
    useEffect(() => {
        console.log('🔄 [ADMIN_CONTEXT] authenticatedAdminId changed to:', authenticatedAdminId);

        if (authenticatedAdminId) {
            console.log('✅ [ADMIN_CONTEXT] Setting authenticatedAdminId in localStorage:', authenticatedAdminId);
            localStorage.setItem("authenticatedAdminId", authenticatedAdminId);
        } else {
            console.log('🧹 [ADMIN_CONTEXT] Clearing authenticatedAdminId from localStorage');
            localStorage.removeItem("authenticatedAdminId");
        }

        console.log('📊 [ADMIN_CONTEXT] Current localStorage authenticatedAdminId:',
            localStorage.getItem("authenticatedAdminId"));
    }, [authenticatedAdminId]);

    // Sync authenticatedAdminUserName with localStorage
    useEffect(() => {
        console.log('🔄 [ADMIN_CONTEXT] authenticatedAdminUserName changed to:', authenticatedAdminUserName);

        if (authenticatedAdminUserName) {
            console.log('✅ [ADMIN_CONTEXT] Setting authenticatedAdminUserName in localStorage:', authenticatedAdminUserName);
            localStorage.setItem("authenticatedAdminUserName", authenticatedAdminUserName);
        } else {
            console.log('🧹 [ADMIN_CONTEXT] Clearing authenticatedAdminUserName from localStorage');
            localStorage.removeItem("authenticatedAdminUserName");
        }

        console.log('📊 [ADMIN_CONTEXT] Current localStorage authenticatedAdminUserName:',
            localStorage.getItem("authenticatedAdminUserName"));
    }, [authenticatedAdminUserName]);

    // Log complete context state for debugging
    useEffect(() => {
        console.log('📊 [ADMIN_CONTEXT] Complete Context State:', {
            adminGroupId,
            authenticatedAdminId,
            authenticatedAdminUserName,
            localStorage: {
                adminGroupId: localStorage.getItem("adminGroupId"),
                authenticatedAdminId: localStorage.getItem("authenticatedAdminId"),
                authenticatedAdminUserName: localStorage.getItem("authenticatedAdminUserName")
            }
        });
    }, [adminGroupId, authenticatedAdminId, authenticatedAdminUserName]);

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