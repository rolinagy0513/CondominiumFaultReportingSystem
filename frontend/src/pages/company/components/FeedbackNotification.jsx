import {useContext, useEffect, useState} from "react";

import {CompanyNotificationContext} from "../../../context/company/CompanyNotificationContext.jsx";

import "./component-styles/FeedbackNotification.css"

const FeedbackNotification = () => {
    const {isFeedbackNotificationOpen, setIsFeedbackNotificationOpen} = useContext(CompanyNotificationContext);

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                setIsFeedbackNotificationOpen(false);
            }, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [setIsFeedbackNotificationOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsFeedbackNotificationOpen(false);
        }, 300);
    };

    if (!isVisible || !isFeedbackNotificationOpen) return null;

    return (
        <div className="feedback-notification">
            <div className="feedback-content">
                <div className="feedback-icon">
                    💬
                </div>

                <div className="feedback-message">
                    <h4>New Feedback Received</h4>
                    <p>
                        <span className="feedback-details">
                            {  "You have received new feedback on your company profile."}
                        </span>
                    </p>
                </div>

                <button
                    className="feedback-close-btn"
                    onClick={handleClose}
                    aria-label="Close feedback notification"
                >
                    ×
                </button>
            </div>

            <div className="feedback-progress-track">
                <div className="feedback-progress-fill"></div>
            </div>

            <div className="feedback-glow-effect"></div>
        </div>
    );
};

export default FeedbackNotification;