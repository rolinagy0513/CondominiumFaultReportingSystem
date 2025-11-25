import {useState, createContext} from "react";

export const CompanyRequestContext = createContext();

export const CompanyRequestProvider = ({ children }) => {

    const [buildings, setBuildings] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showPendingView, setShowPendingView] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        companyEmail: '',
        companyPhoneNumber: '',
        companyAddress: '',
        companyIntroduction: '',
        serviceType: ''
    });
    const [notification, setNotification] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const serviceTypeOptions = [
        { value: '', label: 'Select Service Type' },
        { value: 'ELECTRICIAN', label: 'Electrician' },
        { value: 'PLUMBER', label: 'Plumber' },
        { value: 'CLEANING', label: 'Cleaning' },
        { value: 'SECURITY', label: 'Security' },
        { value: 'ELEVATOR_MAINTENANCE', label: 'Elevator Maintenance' },
        { value: 'GARDENING', label: 'Gardening' },
        { value: 'OTHER', label: 'Other' }
    ];

    return (
        <CompanyRequestContext.Provider value={{
            buildings, setBuildings,
            selectedBuilding, setSelectedBuilding,
            showPendingView, setShowPendingView,
            formData, setFormData,
            notification, setNotification,
            requestSent, setRequestSent,
            isConnected, setIsConnected,serviceTypeOptions
        }}>
            {children}
        </CompanyRequestContext.Provider>
    );
};