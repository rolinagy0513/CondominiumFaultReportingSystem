import {useState, createContext} from "react";

export const ResidentNotificationContext = createContext();

export const ResidentNotificationProvider = ({ children }) => {

    const[isWelcomeNotificationOpen, setIsWelcomeNotificationOpen] = useState(false);
    const[isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen] = useState(false);
    const[isNewReportNotificationOpen, setIsNewReportNotificationOpen] = useState(false);
    const[isStatusChangeNotificationOpen, setIsStatusChangeNotificationOpen] = useState(false);
    const[isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen] = useState(false);

    const[notificationMessage, setNotificationMessage] = useState("");


    return (
        <ResidentNotificationContext.Provider value={{
            isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
            isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen,
            isNewReportNotificationOpen, setIsNewReportNotificationOpen,
            isStatusChangeNotificationOpen, setIsStatusChangeNotificationOpen,
            isUserRemovedNotificationOpen, setIsUserRemovedNotificationOpen,
            notificationMessage, setNotificationMessage
        }}>
            {children}
        </ResidentNotificationContext.Provider>
    );
};