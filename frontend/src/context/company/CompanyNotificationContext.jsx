import {createContext, useState, useEffect} from "react";

export const CompanyNotificationContext = createContext()

export const CompanyNotificationProvider = ({children}) => {

    const [isWelcomeNotificationOpen, setIsWelcomeNotificationOpen] = useState(false);
    const [isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen] = useState(false);
    const [isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPrivateReportCameOpen, setIsPrivateReportCameOpen] = useState(false);
    const [isFeedbackNotificationOpen, setIsFeedbackNotificationOpen] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState([]);
    const [isCompleteReportModalOpen, setIsCompleteReportModalOpen] = useState(false);


    return (
        <CompanyNotificationContext.Provider value={
            {
                isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
                isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen,
                isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen,
                isEditModalOpen, setIsEditModalOpen, isPrivateReportCameOpen, setIsPrivateReportCameOpen,
                isFeedbackNotificationOpen, setIsFeedbackNotificationOpen,
                notificationMessage, setNotificationMessage,
                isCompleteReportModalOpen, setIsCompleteReportModalOpen
            }
        }>
            {children}
        </CompanyNotificationContext.Provider>
    );
};