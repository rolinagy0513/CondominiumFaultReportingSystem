import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import {useApartments} from "../../hooks/useApartments.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useCompanies} from "../../hooks/useCompanies.js";
import {useReports} from "../../hooks/useReports.js";

import Header from "./components/Header.jsx"
import StatOverview from "./components/StatOverview.jsx";
import MainContent from "./components/MainContent.jsx";
import PublicReportModal from "./components/PublicReportModal.jsx";
import PrivateReportModal from "./components/PrivateReportModal.jsx";

import {PaginationContext} from "../../context/general/PaginationContext.jsx";
import {ResidentUserContext} from "../../context/resident/ResidentUserContext.jsx";
import {ResidentApartmentContext} from "../../context/resident/ResidentApartmentContext.jsx";
import {ResidentBuildingContext} from "../../context/resident/ResidentBuildingContext.jsx";
import {ResidentCompanyContext} from "../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";

import "./style/ResidentPage.css"

const ResidentPage = () => {
    const navigate = useNavigate();
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    // const {
    //     residentGroupId,
    //     authenticatedResidentId,
    //     ownersApartmentId,ownersBuildingId,
    //     selectedCompanyId, setSelectedCompanyId,
    //     privateReportFormData, setPrivateReportData,
    //     showPrivateReportForm, setShowPrivateReportForm,
    //     showReportForm, setShowReportForm,
    //     reportFormData, setReportFormData,
    //     selectedServiceType
    // } = useContext(ResidentPageContext);

    const {
        residentGroupId, authenticatedResidentId
    } = useContext(ResidentUserContext);

    const{
        ownersApartmentId
    } = useContext(ResidentApartmentContext);

    const{
        ownersBuildingId
    } = useContext(ResidentBuildingContext);

    const{
        selectedCompanyId, setSelectedCompanyId,
        selectedServiceType
    } = useContext(ResidentCompanyContext);

    const {
        privateReportFormData, setPrivateReportData,
        showPrivateReportForm, setShowPrivateReportForm,
        showReportForm, setShowReportForm,
        reportFormData, setReportFormData,
    } = useContext(ResidentReportContext);

    const {
        currentPage,
    } = useContext(PaginationContext);

    const {
        handleGetApartmentByOwnerId
    } = useApartments();

    const{
        getBuildingByApartmentId
    } = useBuildings()

    const{
        getCompanyByBuildingId,
        getCompanyByBuildingIdAndServiceType
    } = useCompanies()

    const {
        getAllPublicReports,
        sendPublicReport,
        sendPrivateReport,
        getInProgressReport,
    } = useReports()

    const subscriptionRefs = useRef({
        requestResponse: null,
        removal: null,
        notification: null,
        groupTopic: null
    });

    useEffect(() => {
        handleGetApartmentByOwnerId();
        getAllPublicReports(0);
        getInProgressReport();
    }, []);

    useEffect(() => {
        if (ownersApartmentId) {
            getBuildingByApartmentId(ownersApartmentId);
        }
    }, [ownersApartmentId]);

    useEffect(() =>{
        if (ownersBuildingId){
            getCompanyByBuildingId(ownersBuildingId);
        }
    },[ownersBuildingId])

    useEffect(() => {
        if (ownersBuildingId && selectedServiceType) {
            if (selectedServiceType === "ALL") {
                getCompanyByBuildingId(ownersBuildingId);
            } else {
                getCompanyByBuildingIdAndServiceType(ownersBuildingId, selectedServiceType);
            }
        }
    }, [ownersBuildingId, selectedServiceType]);

    useEffect(() => {
        if (!authenticatedResidentId || !residentGroupId) {
            console.log("⚠️ Missing authentication or group info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Resident WebSocket connected successfully");

                const userQueues = [
                    { key: 'requestResponse', path: '/user/queue/request-response' },
                    { key: 'removal', path: '/user/queue/removal' },
                    { key: 'notification', path: '/user/queue/notification' }
                ];

                userQueues.forEach(({ key, path }) => {
                    subscriptionRefs.current[key] = websocketServices.subscribe(
                        path,
                        handleNotification
                    );
                });

                const groupTopic = `/topic/group/${residentGroupId}`;
                subscriptionRefs.current.groupTopic = websocketServices.subscribe(
                    groupTopic,
                    handleNotification
                );
            },
            onDisconnect: () => {
                console.log("🔌 Resident WebSocket disconnected");
                Object.keys(subscriptionRefs.current).forEach(key => {
                    subscriptionRefs.current[key] = null;
                });
            },
            onError: (error) => {
                console.error("❌ WebSocket error:", error);
                Object.keys(subscriptionRefs.current).forEach(key => {
                    subscriptionRefs.current[key] = null;
                });
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            withCredentials: true
        });

        return () => {
            Object.keys(subscriptionRefs.current).forEach(key => {
                if (subscriptionRefs.current[key]) {
                    subscriptionRefs.current[key].unsubscribe();
                    subscriptionRefs.current[key] = null;
                }
            });
            websocketServices.disconnect();
        };
    }, [authenticatedResidentId, residentGroupId]);


    const handleNotification = (notification) => {
        console.log("📬 Resident received notification:", notification);
    };

    const handleLogout = async () => {
        try {
            Object.keys(subscriptionRefs.current).forEach(key => {
                if (subscriptionRefs.current[key]) {
                    subscriptionRefs.current[key].unsubscribe();
                    subscriptionRefs.current[key] = null;
                }
            });

            websocketServices.disconnect();

            await apiServices.post(LOGOUT_URL);
            localStorage.removeItem("residentGroupId");
            localStorage.removeItem("authenticatedResidentId");
            localStorage.removeItem("authenticatedResidentUserName");

            navigate("/");

        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSubmitPublicReport = async (e) => {
        e.preventDefault();
        try {
            await sendPublicReport(reportFormData);

            getAllPublicReports(currentPage);

            setReportFormData({
                name: '',
                issueDescription: '',
                comment: '',
                reportType: 'ELECTRICITY'
            });
            setShowReportForm(false);
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    const handleSubmitPrivateReport = async (e) => {
        e.preventDefault();

        if (!selectedCompanyId) {
            alert('Please select a company first');
            return;
        }

        try {
            await sendPrivateReport(selectedCompanyId, privateReportFormData);

            setPrivateReportData({
                name: '',
                issueDescription: '',
                comment: '',
                reportType: 'ELECTRICITY'
            });
            setShowPrivateReportForm(false);
            setSelectedCompanyId(null);

            await getInProgressReport();

            alert('Private report submitted successfully!');
        } catch (error) {
            console.error('Error submitting private report:', error);
            alert('Failed to submit report. Please try again.');
        }
    };

    return (
        <div className="resident-page">

            <Header
                handleLogout={handleLogout}
            />

            <StatOverview/>

            <MainContent
                getAllPublicReports={getAllPublicReports}
                setShowReportForm={setShowReportForm}
                setShowPrivateReportForm={setShowPrivateReportForm}
            />

            {showReportForm && (
                <PublicReportModal
                    handleSubmitPublicReport={handleSubmitPublicReport}
                />
            )}

            {showPrivateReportForm && (
                <PrivateReportModal
                    handleSubmitPrivateReport={handleSubmitPrivateReport}
                />
            )}
        </div>
    );
};

export default ResidentPage;