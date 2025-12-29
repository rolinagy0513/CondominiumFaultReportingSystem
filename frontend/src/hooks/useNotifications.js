import {NotificationContext} from "../context/admin/NotificationContext.jsx";

import {useContext} from "react";

export const useNotifications = () => {

    const{
        setCompanyNotification, setApartmentNotification, setNewNotification
    } = useContext(NotificationContext);

    const handleNotification = (notification) => {
        if (notification.type === 'COMPANY_REQUEST') {
            setCompanyNotification(notification);
            setNewNotification(true);
        }
        if (notification.type === 'APARTMENT_REQUEST') {
            setApartmentNotification(notification);
            setNewNotification(true);
        }
    };

    const handleCloseApartmentNotification = () => {
        setApartmentNotification(null);
    };

    const handleCloseCompanyNotification = () => {
        setCompanyNotification(null);
    };


    return {handleCloseApartmentNotification, handleCloseCompanyNotification};
};