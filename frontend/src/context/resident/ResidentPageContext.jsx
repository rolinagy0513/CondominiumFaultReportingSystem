import {useState, createContext} from "react";

export const ResidentPageContext = createContext();

export const ResidentPageProvider = ({ children }) => {

    const [ownersApartment, setOwnersApartment] = useState([]);
    const [ownersApartmentId, setOwnersApartmentId] = useState(null);

    const [ownersBuilding, setOwnersBuilding] = useState([]);
    const [ownersBuildingId, setOwnersBuildingId] = useState(null);

    const [companiesInBuilding, setCompaniesInBuilding] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState([]);

    const [publicReports, setPublicReports] = useState([]);
    const [inProgressReports, setInProgressReports] = useState([]);

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
            ownersBuilding, setOwnersBuilding,
            ownersApartmentId, setOwnersApartmentId,
            ownersBuildingId, setOwnersBuildingId,
            companiesInBuilding, setCompaniesInBuilding,
            selectedCompanyId, setSelectedCompanyId,
            selectedCompany, setSelectedCompany,
            publicReports, setPublicReports,
            inProgressReports, setInProgressReports,
            residentGroupId, setResidentGroupId,
            authenticatedResidentId, setAuthenticatedResidentId,
            authenticatedResidentUserName, setAuthenticatedResidentUserName
        }}>
            {children}
        </ResidentPageContext.Provider>
    );
};