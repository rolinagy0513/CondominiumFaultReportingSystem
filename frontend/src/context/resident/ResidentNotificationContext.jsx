import {useState, createContext} from "react";

export const ResidentNotificationContext = createContext();

export const ResidentNotificationProvider = ({ children }) => {

    const[isWelcomeNotificationOpen, setIsWelcomeNotificationOpen] = useState(false);
    const[isRemovalNotificationOpen, setIsRemovalNotificationOpen] = useState(false);
    const[isNewReportNotificationOpen, setIsNewReportNotificationOpen] = useState(false);
    const[isStatusChangeNotificationOpen, setIsStatusChangeNotificationOpen] = useState(false);

    const[notificationMessage, setNotificationMessage] = useState("");


    return (
        <ResidentNotificationContext.Provider value={{
            isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
            isRemovalNotificationOpen, setIsRemovalNotificationOpen,
            isNewReportNotificationOpen, setIsNewReportNotificationOpen,
            isStatusChangeNotificationOpen, setIsStatusChangeNotificationOpen,
            notificationMessage, setNotificationMessage
        }}>
            {children}
        </ResidentNotificationContext.Provider>
    );
};