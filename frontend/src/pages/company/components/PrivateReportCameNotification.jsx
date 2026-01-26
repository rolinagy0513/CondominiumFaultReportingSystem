import {useContext, useEffect, useState} from "react";
import {CompanyPageContext} from "../../../context/company/CompanyPageContext.jsx";

import "./component-styles/PrivateReportCameNotification.css"

const PrivateReportCameNotification = () => {
    const {notificationMessage, setIsPrivateReportCameOpen} = useContext(CompanyPageContext);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setIsPrivateReportCameOpen(false);
            }, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setIsPrivateReportCameOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsPrivateReportCameOpen(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="private-report-notification">
            <div className="private-report-content">
                <div className="report-icon">
                    📄
                </div>

                <div className="private-report-message">
                    <h4>New Private Report</h4>
                    <p>
                        <span className="report-details">{notificationMessage}</span>
                    </p>
                </div>

                <button
                    className="private-report-close-btn"
                    onClick={handleClose}
                    aria-label="Close report notification"
                >
                    ×
                </button>
            </div>

            <div className="private-report-progress-track">
                <div className="private-report-progress-fill"></div>
            </div>

            <div className="private-report-glow-effect"></div>
        </div>
    );
};

export default PrivateReportCameNotification;