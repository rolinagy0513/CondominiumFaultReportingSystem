import {useNotificationVisibility} from "../../../hooks/general/useNotificationVisibility.js";

import { FaTimes } from "react-icons/fa";
import { getServiceIcon } from "../../../utility/GetCompanyLogoUtility.jsx";
import { getServiceTypeDisplay } from "../../../utility/GetCompanyLogoUtility.jsx";

import "./component-styles/CompanyRequestNotification.css";

const CompanyRequestNotification = ({ notification, onClose }) => {
    const { isVisible, handleClose } = useNotificationVisibility(notification, onClose);

    if (!notification || !isVisible) return null;

    return (
        <div className={`company-request-notification ${isVisible ? 'show' : 'hide'}`}>
            <div className="notification-content">
                <div className="notification-header">
                    <div className="notification-icon-wrapper">
                        {getServiceIcon(notification.serviceType)}
                    </div>
                    <div className="notification-title-section">
                        <h4 className="notification-title">New Company Request</h4>
                        <span className="service-type-badge">
                            {getServiceTypeDisplay(notification.serviceType)}
                        </span>
                    </div>
                    <button className="close-notification-btn" onClick={handleClose}>
                        <FaTimes/>
                    </button>
                </div>

                <div className="notification-body">
                    <p className="notification-message">{notification.message}</p>
                    <div className="notification-details">
                        <div className="detail-row">
                            <strong>Company:</strong> {notification.companyName}
                        </div>
                        <div className="detail-row">
                            <strong>Service:</strong> {getServiceTypeDisplay(notification.serviceType)}
                        </div>
                        <div className="detail-row">
                            <strong>Contact:</strong> {notification.companyEmail}
                        </div>
                    </div>
                </div>

                <div className="notification-footer">
                    <span className="notification-sender">From: {notification.senderName}</span>
                    <div className="notification-progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyRequestNotification;