import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import {useCompanies} from "../../hooks/useCompanies.js";
import {useFeedback} from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";

import {CompanyPageContext} from "../../context/company/CompanyPageContext.jsx";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";
import {PaginationContext} from "../../context/general/PaginationContext.jsx";

import websocketServices from "../../services/WebsocketServices.js";
import apiServices from "../../services/ApiServices.js";

import WelcomeNotification from "../../shared-components/WelcomeNotification.jsx";
import CompanyRemovalNotification from "../../shared-components/CompanyRemovalNotification.jsx";
import UserRemovedNotification from "../../shared-components/UserRemovedNotification.jsx";
import PrivateReportCameNotification from "./components/PrivateReportCameNotification.jsx";
import Header from "./components/Header.jsx"
import CompanyInfo from "./components/CompanyInfo.jsx";
import Feedbacks from "./components/Feedbacks.jsx";
import AcceptedReports from "./components/AcceptedReports.jsx";
import BuildingsList from "./components/BuildingsList.jsx";
import MiddleSection from "./components/MiddleSection.jsx";
import FeedbackNotification from "./components/FeedbackNotification.jsx";

import "./style/CompanyPage.css"

const CompanyPage = () => {

    const navigate = useNavigate();

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        usersCompany, usersFeedbacks, usersBuildings,
        authenticatedCompanyUserId,
        companyGroupIdentifier, companyId,
        privateReports, acceptedReports,
        isWelcomeNotificationOpen, setIsWelcomeNotificationOpen,
        setNotificationMessage, notificationMessage,
        isCompanyRemovalNotificationOpen, setIsCompanyRemovalNotificationOpen,
        setIsUserRemovedNotificationOpen, isUserRemovedNotificationOpen,
        isPrivateReportCameOpen, setIsPrivateReportCameOpen,isFeedbackNotificationOpen, setIsFeedbackNotificationOpen
    } = useContext(CompanyPageContext);

    const subscriptionRef = useRef(null);
    const removalSubscriptionRef = useRef(null);
    const notificationSubscriptionRef = useRef(null);
    const requestResponseSubscriptionRef = useRef(null);

    const {
        currentPage, setCurrentPage,
        totalPages, currentPrivatePage,
        setCurrentPrivatePage, totalPrivatePage,
        setTotalPages, setTotalPrivatePage
    } = useContext(PaginationContext);

    const {publicReports} = useContext(ResidentReportContext);

    const {
        getMyCompany
    } = useCompanies();

    const {
        getFeedbacksForCompany
    } = useFeedback();

    const {
        getBuildingsByCompanyId
    } = useBuildings();

    const {
        getAllPublicReports, getPrivateReportsForCompany,
        getAcceptedReportsForCompany,
    } = useReports()

    useEffect(() => {
        getMyCompany();
        getAllPublicReports(0);
        getPrivateReportsForCompany(0, companyId);
        getAcceptedReportsForCompany(companyId);
    }, []);

    useEffect(() => {
        if (usersCompany?.id) {
            getFeedbacksForCompany(usersCompany.id);
            getBuildingsByCompanyId(usersCompany.id);
        }
    }, [usersCompany?.id]);

    useEffect(() => {
        if (!companyGroupIdentifier || !authenticatedCompanyUserId) {
            console.log("⚠️ Missing group or user info, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Company WebSocket connected successfully");

                const groupTopic = `/topic/group/${companyGroupIdentifier}`;
                subscriptionRef.current = websocketServices.subscribe(
                    groupTopic,
                    (message) => {
                        console.log("📬 Received on group topic:", message);
                        handleNotification(message)
                    }
                );

                const requestResponseQueue = `/user/${authenticatedCompanyUserId}/queue/request-response`;
                requestResponseSubscriptionRef.current = websocketServices.subscribe(
                    requestResponseQueue,
                    (message) => {
                        console.log("📬 Company request response:", message);
                    }
                );

                const removalQueue = `/user/${companyId}/queue/removal`;
                removalSubscriptionRef.current = websocketServices.subscribe(
                    removalQueue,
                    (message) => {
                        console.log("📬 Company removal notification:", message);
                    }
                );

                const notificationQueue = `/user/${companyId}/queue/notification`;
                notificationSubscriptionRef.current = websocketServices.subscribe(
                    notificationQueue,
                    (message) => {
                        console.log("📬 Company notification:", message);
                        handleNotification(message);
                    }
                );
            },
        });

        return () => {
            [subscriptionRef, requestResponseSubscriptionRef, removalSubscriptionRef, notificationSubscriptionRef]
                .forEach(ref => {
                    if (ref.current) {
                        ref.current.unsubscribe();
                        ref.current = null;
                    }
                });
            websocketServices.disconnect();
        };
    }, [companyGroupIdentifier, authenticatedCompanyUserId]);

    const handleNotification = (notification) => {
        console.log("📬 Company received notification:", notification);

        setNotificationMessage("");

        switch (notification.type) {

            case "WELCOME":
                setNotificationMessage(notification.message);
                setIsWelcomeNotificationOpen(true)
                break;

            case "PUBLIC_REPORT_CAME":
                getAllPublicReports(currentPage);
                break;

            case "COMPANY_REMOVAL":
                setNotificationMessage(notification.message);
                setIsCompanyRemovalNotificationOpen(true)
                break;

            case "USER_REMOVAL":
                alert(`${notification.message} For further information contact the admin`);
                handleLogout();
                break;

            case "PRIVATE_REPORT_CAME":
                setNotificationMessage(notification.message);
                setIsPrivateReportCameOpen(true)
                getPrivateReportsForCompany(0, companyId);
                break;

            case "USER_REMOVAL_GROUP":
                setNotificationMessage(notification.message);
                setIsUserRemovedNotificationOpen(true);
                getAllPublicReports(currentPage);
                break;

            case "FEEDBACK_CAME":
                setNotificationMessage(notification.message)
                setIsFeedbackNotificationOpen(true)
                getFeedbacksForCompany(companyId)
                getMyCompany()
                break;

            default:
                console.warn("Unknown notification type:", notification.type);
        }
    };

    if (!usersCompany) {
        return <p>Loading...</p>;
    }

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

            localStorage.removeItem("authenticatedCompanyUserId");
            localStorage.removeItem("companyId");
            localStorage.removeItem("authenticatedCompanyUserName");
            localStorage.removeItem("companyGroupId");
            localStorage.removeItem("authenticatedCompanyGroupIdentifier");

            navigate("/");

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="company-page-container">
            <Header handleLogout={handleLogout}/>

            <div className="company-page-layout">

                <div className="company-page-left-sidebar">
                    <CompanyInfo/>
                    <Feedbacks/>
                </div>

                <MiddleSection/>

                <div className="company-page-right-sidebar">
                    <AcceptedReports/>
                    <BuildingsList/>
                </div>
            </div>

            {isWelcomeNotificationOpen && (
                <WelcomeNotification
                    notificationMessage={notificationMessage}
                    setIsWelcomeNotificationOpen={setIsWelcomeNotificationOpen}
                />
            )}

            {isCompanyRemovalNotificationOpen && (
                <CompanyRemovalNotification
                    notificationMessage={notificationMessage}
                    setIsCompanyRemovalNotificationOpen={setIsCompanyRemovalNotificationOpen}
                />
            )}

            {isUserRemovedNotificationOpen && (
                <UserRemovedNotification
                    notificationMessage={notificationMessage}
                    setIsUserRemovedNotificationOpen={setIsUserRemovedNotificationOpen}
                />
            )}

            {isPrivateReportCameOpen && (
                <PrivateReportCameNotification/>
            )}

            {isFeedbackNotificationOpen && (
                <FeedbackNotification/>
            )}
        </div>
    );
};

export default CompanyPage;