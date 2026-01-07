import {useState, createContext} from "react";

export const ResidentUserContext = createContext();

export const ResidentUserProvider = ({ children }) => {

    const [residentGroupId, setResidentGroupId] = useState(() =>
        localStorage.getItem("residentGroupId")
    )

    const [authenticatedResidentId, setAuthenticatedResidentId] = useState(() =>
        localStorage.getItem("authenticatedResidentId")
    );

    const [authenticatedResidentUserName, setAuthenticatedResidentUserName] = useState(() =>
        localStorage.getItem("authenticatedResidentUserName")
    );

    return (
        <ResidentUserContext.Provider value={{
            residentGroupId, setResidentGroupId,
            authenticatedResidentId, setAuthenticatedResidentId,
            authenticatedResidentUserName, setAuthenticatedResidentUserName
        }}>
            {children}
        </ResidentUserContext.Provider>
    );
};