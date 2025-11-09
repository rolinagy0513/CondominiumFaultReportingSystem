import { useEffect, useState } from "react";

export const useNotificationVisibility = (notification, onClose, duration = 15000) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);

            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [notification, onClose, duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
    };

    return {
        isVisible,
        handleClose
    };
};