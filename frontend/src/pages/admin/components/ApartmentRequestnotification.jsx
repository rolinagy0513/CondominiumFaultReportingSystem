import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaBuilding} from "react-icons/fa6";

import "./component-styles/ApartmentRequestNotification.css";

const ApartmentRequestNotification = ({ notification, onClose }) => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
            }, 15000);

            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    const getStatusInfo = (status) => {
        switch (status?.toUpperCase()) {
            case 'AVAILABLE':
                return { text: 'Available', color: '#10b981' };
            case 'OCCUPIED':
                return { text: 'Occupied', color: '#ef4444' };
            case 'PENDING':
                return { text: 'Pending', color: '#f59e0b' };
            case 'UNAVAILABLE':
                return { text: 'Unavailable', color: '#6b7280' };
            default:
                return { text: status || 'Unknown', color: '#6b7280' };
        }
    };

    const statusInfo = getStatusInfo(notification?.apartmentStatus);

    if (!notification || !isVisible) return null;

    return (
        <div className={`apartment-request-notification ${isVisible ? 'show' : 'hide'}`}>
            <div className="notification-content">
                <div className="notification-header">
                    <div className="notification-icon-wrapper">
                        <FaBuilding className="notification-service-icon apartment-icon" />
                    </div>
                    <div className="notification-title-section">
                        <h4 className="notification-title">New Apartment Request</h4>
                        <span
                            className="status-badge"
                            style={{ backgroundColor: statusInfo.color }}
                        >
                            {statusInfo.text}
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
                            <strong>Building:</strong>
                            <span>#{notification.buildingNumber}</span>
                        </div>
                        <div className="detail-row">
                            <strong>Apartment:</strong>
                            <span>#{notification.apartmentNumber} (Floor {notification.floor})</span>
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

export default ApartmentRequestNotification;