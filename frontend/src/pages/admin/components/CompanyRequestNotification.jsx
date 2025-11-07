import { useEffect, useState } from "react";

import {FaBusinessTime} from "react-icons/fa6";
import { MdElectricBolt } from "react-icons/md";
import { MdPlumbing } from "react-icons/md";
import { FaBroom } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { GiElevator } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import { IoMdBuild } from "react-icons/io";
import { FaTimes } from "react-icons/fa";

import "./component-styles/CompanyRequestNotification.css";

const CompanyRequestNotification = ({ notification, onClose }) => {

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


    const getServiceIcon = (serviceType) => {
        switch (serviceType?.toUpperCase()) {
            case 'ELECTRICIAN':
                return <MdElectricBolt className="notification-service-icon electrician-icon" />;
            case 'PLUMBER':
                return <MdPlumbing className="notification-service-icon plumber-icon" />;
            case 'CLEANING':
                return <FaBroom className="notification-service-icon cleaning-icon" />;
            case 'SECURITY':
                return <MdSecurity className="notification-service-icon security-icon" />;
            case 'ELEVATOR_MAINTENANCE':
                return <GiElevator className="notification-service-icon elevator-icon" />;
            case 'GARDENING':
                return <FaLeaf className="notification-service-icon gardening-icon" />;
            case 'OTHER':
                return <IoMdBuild className="notification-service-icon other-icon" />;
            default:
                return <FaBusinessTime className="notification-service-icon default-company-icon" />;
        }
    };

    const getServiceTypeDisplay = (serviceType) => {
        switch (serviceType?.toUpperCase()) {
            case 'ELECTRICIAN':
                return 'Electrician';
            case 'PLUMBER':
                return 'Plumber';
            case 'CLEANING':
                return 'Cleaning';
            case 'SECURITY':
                return 'Security';
            case 'ELEVATOR_MAINTENANCE':
                return 'Elevator Maintenance';
            case 'GARDENING':
                return 'Gardening';
            case 'OTHER':
                return 'Other Services';
            default:
                return serviceType || 'Unknown Service';
        }
    };

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