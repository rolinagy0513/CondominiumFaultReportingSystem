import {useContext, useEffect, useState} from "react";
import "./components-styles/WelcomeNotification.css"
import {ResidentNotificationContext} from "../../../context/resident/ResidentNotificationContext.jsx";

const WelcomeNotification = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const{setIsWelcomeNotificationOpen, notificationMessage} = useContext(ResidentNotificationContext);

    console.log(notificationMessage)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setIsWelcomeNotificationOpen(false)
            }, 300);
        }, 6000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsWelcomeNotificationOpen(false)
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="welcome-notification">
            <div className="welcome-notification-content">
                <div className="welcome-icon">
                    <span className="welcome-emoji">🎉</span>
                    <span className="welcome-star">★</span>
                </div>
                <div className="welcome-message">
                    <h4>Welcome!</h4>
                    <p>{notificationMessage}</p>
                </div>
                <button
                    className="welcome-close-btn"
                    onClick={handleClose}
                    aria-label="Close welcome notification"
                >
                    ×
                </button>
            </div>
            <div className="welcome-progress-bar"></div>
        </div>
    );
};

export default WelcomeNotification;