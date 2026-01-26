import {useEffect, useState} from "react";

import "./styles/RemovalNotification.css"

const UserRemovedNotification = ({notificationMessage, setIsUserRemovedNotificationOpen}) =>{

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setIsUserRemovedNotificationOpen(false);
            }, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setIsUserRemovedNotificationOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsUserRemovedNotificationOpen(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="removal-notification">
            <div className="removal-content">

                <div className="removal-message">
                    <h4>User left the group</h4>
                    <p>
                        <span className="removal-name">{notificationMessage}</span>
                    </p>
                </div>

                <button
                    className="removal-close-btn"
                    onClick={handleClose}
                    aria-label="Close removal notification"
                >
                    ×
                </button>
            </div>

            <div className="removal-progress-track">
                <div className="removal-progress-fill"></div>
            </div>

            <div className="removal-dust-effect"></div>
        </div>
    );



}

export default UserRemovedNotification;