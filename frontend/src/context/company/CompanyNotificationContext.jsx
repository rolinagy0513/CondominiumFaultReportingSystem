import {createContext, useState, useEffect} from "react";

export const CompanyNotificationContext = createContext()

export const CompanyNotificationProvider = ({children}) => {

    const [isWelcomeNotificationOpen, setIsWelcomeNotificationOpen] = useState(false);
    const [isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen] = useState(false);
    const [isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPrivateReportCameOpen, setIsPrivateReportCameOpen] = useState(false);

    return (
        <CompanyNotificationContext.Provider value={
            {
                isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
                isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen,
                isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen,
                isEditModalOpen, setIsEditModalOpen
            }
        }>
            {children}
        </CompanyNotificationContext.Provider>
    );
};