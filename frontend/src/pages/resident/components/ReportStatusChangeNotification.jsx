import {useContext, useEffect, useState} from "react";
import {ResidentNotificationContext} from "../../../context/resident/ResidentNotificationContext.jsx";

import "./components-styles/ReportStatusChangeNotification.css"

const ReportStatusChangeNotification = () => {

    const {notificationMessage, setIsStatusChangeNotificationOpen} = useContext(ResidentNotificationContext);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setIsStatusChangeNotificationOpen(false);
            }, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setIsStatusChangeNotificationOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsStatusChangeNotificationOpen(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="report-status-changed-notification info">
            <div>
                <span>{notificationMessage}</span>
                <button onClick={handleClose} aria-label="Close notification">
                    ×
                </button>
            </div>
        </div>
    );
};

export default ReportStatusChangeNotification;