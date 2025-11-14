export const useNotifications = (
    SOCK_URL, adminGroupId, setCompanyNotification,
    setApartmentNotification, setNewNotification
) => {

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