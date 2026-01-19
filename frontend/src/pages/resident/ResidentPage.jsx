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
import CompletedReportModal from "./components/CompletedReportModal.jsx";
import CompanyModal from "./components/CompanyModal.jsx";

import {PaginationContext} from "../../context/general/PaginationContext.jsx";
import {ResidentUserContext} from "../../context/resident/ResidentUserContext.jsx";
import {ResidentApartmentContext} from "../../context/resident/ResidentApartmentContext.jsx";
import {ResidentBuildingContext} from "../../context/resident/ResidentBuildingContext.jsx";
import {ResidentCompanyContext} from "../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";
import {ResidentNotificationContext} from "../../context/resident/ResidentNotificationContext.jsx";

import "./style/ResidentPage.css"
import ReportStatusChangeNotification from "./components/ReportStatusChangeNotification.jsx";
import WelcomeNotification from "./components/WelcomeNotification.jsx";
import CompanyRemovalNotification from "./components/CompanyRemovalNotification.jsx";

const ResidentPage = () => {
    const navigate = useNavigate();
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    useEffect(()=>{
        console.log(residentGroupIdentifier)
    },[])

    const {
        residentGroupIdentifier
    } = useContext(ResidentUserContext);

    const{
        ownersApartmentId
    } = useContext(ResidentApartmentContext);

    const{
        ownersBuildingId
    } = useContext(ResidentBuildingContext);

    const ownersBuildingIdRef = useRef(ownersBuildingId);

    const{
        selectedCompanyId, setSelectedCompanyId,
        selectedServiceType, expandedCompanyId,
        companyModalOpen, expandedCompany
    } = useContext(ResidentCompanyContext);

    const {
        privateReportFormData, setPrivateReportData,
        showPrivateReportForm, setShowPrivateReportForm,
        showReportForm, setShowReportForm,
        reportFormData, setReportFormData,
        completeReportModalOpen,
    } = useContext(ResidentReportContext);

    const {
        currentPage,
    } = useContext(PaginationContext);

    const {
        isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
        isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen,
        isNewReportNotificationOpen, setIsNewReportNotificationOpen,
        isStatusChangeNotificationOpen, setIsStatusChangeNotificationOpen,
        notificationMessage, setNotificationMessage
    } = useContext(ResidentNotificationContext);

    const {
        handleGetApartmentByOwnerId
    } = useApartments();

    const{
        getBuildingByApartmentId
    } = useBuildings()

    const{
        getCompanyByBuildingId,
        getCompanyByBuildingIdAndServiceType,
        getCompanyWithFeedbacks
    } = useCompanies()

    const {
        getAllPublicReports,
        sendPublicReport,
        sendPrivateReport,
        getInProgressReport,
        getCompletedReportsForUser,
    } = useReports()

    const subscriptionRef = useRef(null);
    const removalSubscriptionRef = useRef(null);
    const notificationSubscriptionRef = useRef(null);

    useEffect(() => {
        if(companyModalOpen && expandedCompanyId){
            getCompanyWithFeedbacks(expandedCompanyId);
        }
    }, [companyModalOpen, expandedCompanyId]);

    useEffect(() => {
        handleGetApartmentByOwnerId();
        getAllPublicReports(0);
        getInProgressReport();
        getCompletedReportsForUser()
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
        const authenticatedResidentId = localStorage.getItem("authenticatedResidentId");

        if (!residentGroupIdentifier || !authenticatedResidentId) {
            console.log("⚠️ Missing group or user info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Resident WebSocket connected successfully");
                console.log("📋 Resident Group Identifier:", residentGroupIdentifier);
                console.log("👤 Authenticated Resident ID:", authenticatedResidentId);

                const groupTopic = `/topic/group/${residentGroupIdentifier}`;
                console.log("🔌 Subscribing to group topic:", groupTopic);

                subscriptionRef.current = websocketServices.subscribe(
                    groupTopic,
                    (message) => {
                        console.log("📬 Received on group topic:", message);
                        handleNotification(message);
                    }
                );

                if (subscriptionRef.current) {
                    console.log("✅ Successfully subscribed to group topic");
                } else {
                    console.error("❌ Failed to subscribe to group topic");
                }

                const removalQueue = `/user/${authenticatedResidentId}/queue/removal`;
                console.log("🔌 Subscribing to removal queue:", removalQueue);

                removalSubscriptionRef.current = websocketServices.subscribe(
                    removalQueue,
                    (message) => {
                        console.log("📬 Received on removal queue:", message);
                        handleNotification(message);
                    }
                );

                if (removalSubscriptionRef.current) {
                    console.log("✅ Successfully subscribed to removal queue");
                } else {
                    console.error("❌ Failed to subscribe to removal queue");
                }

                const notificationQueue = `/user/${authenticatedResidentId}/queue/notification`;
                console.log("🔌 Subscribing to notification queue:", notificationQueue);

                notificationSubscriptionRef.current = websocketServices.subscribe(
                    notificationQueue,
                    (message) => {
                        console.log("📬 Received on notification queue:", message);
                        handleNotification(message);
                    }
                );

                if (notificationSubscriptionRef.current) {
                    console.log("✅ Successfully subscribed to notification queue");
                } else {
                    console.error("❌ Failed to subscribe to notification queue");
                }
            },
            onDisconnect: () => {
                console.log("🔌 Resident WebSocket disconnected");
                subscriptionRef.current = null;
                removalSubscriptionRef.current = null;
                notificationSubscriptionRef.current = null;
            },
            onError: (error) => {
                console.error("❌ WebSocket error:", error);
                subscriptionRef.current = null;
                removalSubscriptionRef.current = null;
                notificationSubscriptionRef.current = null;
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            withCredentials: true
        });

        return () => {

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (removalSubscriptionRef.current) {
                removalSubscriptionRef.current.unsubscribe();
                removalSubscriptionRef.current = null;
            }
            if (notificationSubscriptionRef.current) {
                notificationSubscriptionRef.current.unsubscribe();
                notificationSubscriptionRef.current = null;
            }
            websocketServices.disconnect();
        };
    }, [residentGroupIdentifier]);


    const handleNotification = (notification) => {
        console.log("📬 Resident received notification:", notification);

        switch (notification.type) {

            case "COMPANY_REMOVAL":
                setNotificationMessage(notification.message);
                setIsCompanyRemovalNotificationOpen(true)
                if (ownersBuildingId) {
                    getCompanyByBuildingId(ownersBuildingId);
                }
                break;

            case "USER_REMOVAL":
                alert(`${notification.message} For further information contact the admin`);
                handleLogout();
                break;

            case "USER_REMOVAL_GROUP":
                alert("The message: " + notification.message)
                getAllPublicReports(currentPage);
                break;

            case "WELCOME":
                setNotificationMessage(notification.message);
                setIsWelcomeNotificationOpen(true)
                if (ownersBuildingId) {
                    getCompanyByBuildingId(ownersBuildingId);
                }
                break;

            case "REPORT_ACCEPTED":
                setNotificationMessage(notification.message);
                setIsStatusChangeNotificationOpen(true)
                getAllPublicReports(currentPage);
                getInProgressReport();
                break;

            case "REPORT_COMPLETED":
                setNotificationMessage(notification.message);
                setIsStatusChangeNotificationOpen(true);
                getCompletedReportsForUser();
                getInProgressReport();
                break;

            default:
                console.warn("Unknown notification type:", notification.type);
        }
    };

    const handleLogout = async () => {
        try {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (removalSubscriptionRef.current) {
                removalSubscriptionRef.current.unsubscribe();
                removalSubscriptionRef.current = null;
            }
            if (notificationSubscriptionRef.current) {
                notificationSubscriptionRef.current.unsubscribe();
                notificationSubscriptionRef.current = null;
            }

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

            {completeReportModalOpen &&(
                <CompletedReportModal/>
            )}

            {companyModalOpen && (
                <CompanyModal/>
            )}

            {isStatusChangeNotificationOpen &&(
                <ReportStatusChangeNotification/>
            )}

            {isWelcomeNotificationOpen &&(
                <WelcomeNotification/>
            )}

            {isCompanyRemovalNotificationOpen &&(
                <CompanyRemovalNotification/>
            )}

        </div>
    );
};

export default ResidentPage;