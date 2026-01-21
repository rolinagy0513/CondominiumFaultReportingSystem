import {createContext, useState, useEffect} from "react";

export const CompanyPageContext = createContext()

export const CompanyPageProvider = ({children}) => {

    const [authenticatedCompanyUserId, setAuthenticatedCompanyUserId] = useState(() => {
        const storedId = localStorage.getItem("authenticatedCompanyUserId");
        console.log('🔍 [COMPANY_CONTEXT] Initial authenticatedCompanyUserId from localStorage:', storedId);
        return storedId;
    });

    const [companyId, setCompanyId] = useState(() => {
        const storedId = localStorage.getItem("companyId");
        console.log('🔍 [COMPANY_CONTEXT] Initial companyId from localStorage:', storedId);
        return storedId;
    });

    const [authenticatedCompanyUserName, setAuthenticatedCompanyUserName] = useState(() => {
        const storedName = localStorage.getItem("authenticatedCompanyUserName");
        console.log('🔍 [COMPANY_CONTEXT] Initial authenticatedCompanyUserName from localStorage:', storedName);
        return storedName;
    });

    const [companyGroupId, setCompanyGroupId] = useState(() => {
        const storedId = localStorage.getItem("companyGroupId");
        console.log('🔍 [COMPANY_CONTEXT] Initial companyGroupId from localStorage:', storedId);
        return storedId;
    });

    const [companyGroupIdentifier, setCompanyGroupIdentifier] = useState(() => {
        const storedIdentifier = localStorage.getItem("authenticatedCompanyGroupIdentifier");
        console.log('🔍 [COMPANY_CONTEXT] Initial companyGroupIdentifier from localStorage:', storedIdentifier);
        return storedIdentifier;
    });

    const [usersCompany, setUsersCompany] = useState([]);
    const [usersFeedbacks, setUsersFeedbacks] = useState([]);
    const [usersBuildings, setUsersBuildings] = useState([]);
    const [privateReports, setPrivateReports] = useState([]);
    const [acceptedReports, setAcceptedReports] = useState([]);


    useEffect(() => {
        console.log('🔄 [COMPANY_CONTEXT] authenticatedCompanyUserId changed to:', authenticatedCompanyUserId);

        if (authenticatedCompanyUserId) {
            console.log('✅ [COMPANY_CONTEXT] Setting authenticatedCompanyUserId in localStorage:', authenticatedCompanyUserId);
            localStorage.setItem("authenticatedCompanyUserId", authenticatedCompanyUserId);
        } else {
            console.log('🧹 [COMPANY_CONTEXT] Clearing authenticatedCompanyUserId from localStorage');
            localStorage.removeItem("authenticatedCompanyUserId");
        }

        console.log('📊 [COMPANY_CONTEXT] Current localStorage authenticatedCompanyUserId:',
            localStorage.getItem("authenticatedCompanyUserId"));
    }, [authenticatedCompanyUserId]);

    // Sync companyId with localStorage
    useEffect(() => {
        console.log('🔄 [COMPANY_CONTEXT] companyId changed to:', companyId);

        if (companyId) {
            console.log('✅ [COMPANY_CONTEXT] Setting companyId in localStorage:', companyId);
            localStorage.setItem("companyId", companyId);
        } else {
            console.log('🧹 [COMPANY_CONTEXT] Clearing companyId from localStorage');
            localStorage.removeItem("companyId");
        }

        console.log('📊 [COMPANY_CONTEXT] Current localStorage companyId:',
            localStorage.getItem("companyId"));
    }, [companyId]);

    // Sync authenticatedCompanyUserName with localStorage
    useEffect(() => {
        console.log('🔄 [COMPANY_CONTEXT] authenticatedCompanyUserName changed to:', authenticatedCompanyUserName);

        if (authenticatedCompanyUserName) {
            console.log('✅ [COMPANY_CONTEXT] Setting authenticatedCompanyUserName in localStorage:', authenticatedCompanyUserName);
            localStorage.setItem("authenticatedCompanyUserName", authenticatedCompanyUserName);
        } else {
            console.log('🧹 [COMPANY_CONTEXT] Clearing authenticatedCompanyUserName from localStorage');
            localStorage.removeItem("authenticatedCompanyUserName");
        }

        console.log('📊 [COMPANY_CONTEXT] Current localStorage authenticatedCompanyUserName:',
            localStorage.getItem("authenticatedCompanyUserName"));
    }, [authenticatedCompanyUserName]);

    // Sync companyGroupId with localStorage
    useEffect(() => {
        console.log('🔄 [COMPANY_CONTEXT] companyGroupId changed to:', companyGroupId);

        if (companyGroupId) {
            console.log('✅ [COMPANY_CONTEXT] Setting companyGroupId in localStorage:', companyGroupId);
            localStorage.setItem("companyGroupId", companyGroupId);
        } else {
            console.log('🧹 [COMPANY_CONTEXT] Clearing companyGroupId from localStorage');
            localStorage.removeItem("companyGroupId");
        }

        console.log('📊 [COMPANY_CONTEXT] Current localStorage companyGroupId:',
            localStorage.getItem("companyGroupId"));
    }, [companyGroupId]);


    useEffect(() => {
        console.log('🔄 [COMPANY_CONTEXT] companyGroupIdentifier changed to:', companyGroupIdentifier);

        if (companyGroupIdentifier) {
            console.log('✅ [COMPANY_CONTEXT] Setting companyGroupIdentifier in localStorage:', companyGroupIdentifier);
            localStorage.setItem("authenticatedCompanyGroupIdentifier", companyGroupIdentifier);
        } else {
            console.log('🧹 [COMPANY_CONTEXT] Clearing companyGroupIdentifier from localStorage');
            localStorage.removeItem("authenticatedCompanyGroupIdentifier");
        }

        console.log('📊 [COMPANY_CONTEXT] Current localStorage companyGroupIdentifier:',
            localStorage.getItem("authenticatedCompanyGroupIdentifier"));
    }, [companyGroupIdentifier]);

    useEffect(() => {
        console.log('📊 [COMPANY_CONTEXT] Complete Context State:', {
            authenticatedCompanyUserId,
            companyId,
            authenticatedCompanyUserName,
            companyGroupId,
            companyGroupIdentifier,
            localStorage: {
                authenticatedCompanyUserId: localStorage.getItem("authenticatedCompanyUserId"),
                companyId: localStorage.getItem("companyId"),
                authenticatedCompanyUserName: localStorage.getItem("authenticatedCompanyUserName"),
                companyGroupId: localStorage.getItem("companyGroupId"),
                companyGroupIdentifier: localStorage.getItem("authenticatedCompanyGroupIdentifier")
            }
        });
    }, [authenticatedCompanyUserId, companyId, authenticatedCompanyUserName, companyGroupId, companyGroupIdentifier]);

    return (
        <CompanyPageContext.Provider value={
            {
                usersCompany, setUsersCompany,
                usersFeedbacks, setUsersFeedbacks,
                usersBuildings, setUsersBuildings,
                authenticatedCompanyUserId, setAuthenticatedCompanyUserId,
                companyId, setCompanyId,
                authenticatedCompanyUserName, setAuthenticatedCompanyUserName,
                companyGroupId, setCompanyGroupId,
                companyGroupIdentifier, setCompanyGroupIdentifier,
                privateReports, setPrivateReports,
                acceptedReports, setAcceptedReports
            }
        }>
            {children}
        </CompanyPageContext.Provider>
    );
};