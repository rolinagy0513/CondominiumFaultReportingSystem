import {useState, createContext} from "react";

export const ResidentPageContext = createContext();

export const ResidentPageProvider = ({ children }) => {

    const [ownersApartment, setOwnersApartment] = useState([])

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
        <ResidentPageContext.Provider value={{
            ownersApartment, setOwnersApartment,
            residentGroupId, setResidentGroupId,
            authenticatedResidentId, setAuthenticatedResidentId,
            authenticatedResidentUserName, setAuthenticatedResidentUserName
        }}>
            {children}
        </ResidentPageContext.Provider>
    );
};