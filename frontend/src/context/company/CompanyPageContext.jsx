import {createContext, use, useState} from "react";

export const CompanyPageContext = createContext()

export const  CompanyPageProvider = ({children}) => {

    const [authenticatedCompanyUserId, setAuthenticatedCompanyUserId] = useState(()=>{
        localStorage.getItem("authenticatedCompanyUserId");
    })

    const [authenticatedCompanyUserName, setAuthenticatedCompanyUserName] = useState(()=>{
        localStorage.getItem("authenticatedCompanyUserName");
    })

    const  [companyGroupId, setCompanyGroupId] = useState(()=>{
        localStorage.getItem("companyGroupId");
    });


    const [companyGroupIdentifier, setCompanyGroupIdentifier] = useState(()=>{
        localStorage.getItem("authenticatedCompanyGroupIdentifier");
    })


    const [usersCompany, setUsersCompany] = useState([]);
    const [usersFeedbacks, setUsersFeedbacks] = useState([]);
    const [usersBuildings, setUsersBuildings] = useState([]);

    return (
        <CompanyPageContext.Provider value={
            {
                usersCompany, setUsersCompany,
                usersFeedbacks, setUsersFeedbacks,
                usersBuildings, setUsersBuildings,
                authenticatedCompanyUserId, setAuthenticatedCompanyUserId,
                authenticatedCompanyUserName, setAuthenticatedCompanyUserName,
                companyGroupId, setCompanyGroupId,
                companyGroupIdentifier, setCompanyGroupIdentifier,
            }
        }>
            {children}
        </CompanyPageContext.Provider>
    );

};