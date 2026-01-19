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
import websocketServices from "../../services/WebsocketServices.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [authenticatedUserId, setAuthenticatedUserId] = useState(() => {
        const storedId = localStorage.getItem("authenticatedUserId");
        console.log('🔍 [USER_CONTEXT] Initial authenticatedUserId from localStorage:', storedId);
        return storedId;
    });

    const [authenticatedUserName, setAuthenticatedUserName] = useState(() => {
        const storedName = localStorage.getItem("authenticatedUserName");
        console.log('🔍 [USER_CONTEXT] Initial authenticatedUserName from localStorage:', storedName);
        return storedName;
    });

    // Sync authenticatedUserId with localStorage
    useEffect(() => {
        console.log('🔄 [USER_CONTEXT] authenticatedUserId changed to:', authenticatedUserId);

        if (authenticatedUserId) {
            console.log('✅ [USER_CONTEXT] Setting authenticatedUserId in localStorage:', authenticatedUserId);
            localStorage.setItem("authenticatedUserId", authenticatedUserId);
        } else {
            console.log('🧹 [USER_CONTEXT] Clearing authenticatedUserId from localStorage');
            localStorage.removeItem("authenticatedUserId");

            // ✅ FIX: Only disconnect WebSocket if NO other user types are logged in
            const hasAdminUser = localStorage.getItem("authenticatedAdminId");
            const hasResidentUser = localStorage.getItem("authenticatedResidentId");
            const hasCompanyUser = localStorage.getItem("authenticatedCompanyUserId");

            if (!hasAdminUser && !hasResidentUser && !hasCompanyUser) {
                console.log('🔌 [USER_CONTEXT] No users logged in - disconnecting WebSocket');
                websocketServices.disconnect();
            } else {
                console.log('⚠️ [USER_CONTEXT] Other user types still logged in - NOT disconnecting WebSocket');
            }
        }

        // Log current localStorage state
        console.log('📊 [USER_CONTEXT] Current localStorage authenticatedUserId:',
            localStorage.getItem("authenticatedUserId"));
    }, [authenticatedUserId]);

    // Sync authenticatedUserName with localStorage
    useEffect(() => {
        console.log('🔄 [USER_CONTEXT] authenticatedUserName changed to:', authenticatedUserName);

        if (authenticatedUserName) {
            console.log('✅ [USER_CONTEXT] Setting authenticatedUserName in localStorage:', authenticatedUserName);
            localStorage.setItem("authenticatedUserName", authenticatedUserName);
        } else {
            console.log('🧹 [USER_CONTEXT] Clearing authenticatedUserName from localStorage');
            localStorage.removeItem("authenticatedUserName");
        }

        // Log current localStorage state
        console.log('📊 [USER_CONTEXT] Current localStorage authenticatedUserName:',
            localStorage.getItem("authenticatedUserName"));
    }, [authenticatedUserName]);

    useEffect(() => {
        console.log('📊 [USER_CONTEXT] Context State:', {
            authenticatedUserId,
            authenticatedUserName,
            localStorageUserId: localStorage.getItem("authenticatedUserId"),
            localStorageUserName: localStorage.getItem("authenticatedUserName")
        });
    }, [authenticatedUserId, authenticatedUserName]);

    return (
        <UserContext.Provider value={{
            authenticatedUserId,
            setAuthenticatedUserId,
            authenticatedUserName,
            setAuthenticatedUserName,
        }}>
            {children}
        </UserContext.Provider>
    );
};