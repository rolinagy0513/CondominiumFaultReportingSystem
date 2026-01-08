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

    const subscriptionRef = useRef(null);

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
        if (!residentGroupId) {
            console.log("⚠️ Missing group info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Resident WebSocket connected successfully");
                console.log("📋 Resident Group ID:", residentGroupId);

                const groupTopic = `/topic/group/${residentGroupId}`;
                console.log("🔌 Subscribing to group topic:", groupTopic);

                //Itt csak a group van ide be kell adni majd a user-eket is ami meg azért nem ment mert nem próbáltam rendesen ki.
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
            },
            onDisconnect: () => {
                console.log("🔌 Resident WebSocket disconnected");
                subscriptionRef.current = null;
            },
            onError: (error) => {
                console.error("❌ WebSocket error:", error);
                subscriptionRef.current = null;
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
            websocketServices.disconnect();
        };
    }, [residentGroupId]);


    // const handleNotification = (notification) => {
    //     console.log("📬 Resident received notification:", notification);
    //
    //     switch (notification.type) {
    //         case "COMPANY_REMOVAL":
    //             alert("The company left notification alert: " + notification.message);
    //             if (ownersBuildingId) {
    //                 getCompanyByBuildingId(ownersBuildingId);
    //             }
    //             break;
    //
    //         case "USER_REMOVAL":
    //             alert("The user left notification alert: " + notification.message);
    //             // Note: This will only show for other users leaving, not for yourself
    //             // since your own removal notification goes to /user/{id}/queue/removal
    //             break;
    //
    //         case "PUBLIC_REPORT_CAME":
    //             alert("New public report notification: " + notification.message);
    //             getAllPublicReports(currentPage);
    //             break;
    //
    //         case "WELCOME":
    //             alert("Welcome notification: " + notification.message);
    //             break;
    //
    //         default:
    //             console.warn("Unknown notification type:", notification.type);
    //     }
    // };

    const handleLogout = async () => {
        try {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
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
        </div>
    );
};

export default ResidentPage;