import {createContext, use, useState} from "react";

export const CompanyPageContext = createContext()

export const  CompanyPageProvider = ({children}) => {

    const [usersCompany, setUsersCompany] = useState([]);
    const [usersFeedbacks, setUsersFeedbacks] = useState([]);
    const [usersBuildings, setUsersBuildings] = useState([]);

    return (
        <CompanyPageContext.Provider value={
            {
                usersCompany, setUsersCompany,
                usersFeedbacks, setUsersFeedbacks,
                usersBuildings, setUsersBuildings
            }
        }>
            {children}
        </CompanyPageContext.Provider>
    );

};