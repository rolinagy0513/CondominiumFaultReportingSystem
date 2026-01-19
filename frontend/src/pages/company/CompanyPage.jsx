import {useContext, useEffect, useRef} from "react";

import { useCompanies } from "../../hooks/useCompanies.js";
import { useFeedback } from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";

import { CompanyPageContext } from "../../context/company/CompanyPageContext.jsx";

import websocketServices from "../../services/WebsocketServices.js";

import "./style/CompanyPage.css";
import {ResidentReportContext} from "../../context/resident/ResidentReportContext.jsx";

const CompanyPage = () => {

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const {
        usersCompany, usersFeedbacks, usersBuildings,
        authenticatedCompanyUserId,
        companyGroupIdentifier, companyId
    } = useContext(CompanyPageContext);

    const {
        publicReports
    } = useContext(ResidentReportContext);

    const subscriptionRef = useRef(null);
    const removalSubscriptionRef = useRef(null);
    const notificationSubscriptionRef = useRef(null);
    const requestResponseSubscriptionRef = useRef(null);

    const { getMyCompany } = useCompanies();
    const { getFeedbacksForCompany } = useFeedback();
    const { getBuildingsByCompanyId } = useBuildings();
    const { getAllPublicReports } = useReports()

    useEffect(() => {
        getMyCompany();
        getAllPublicReports(0);
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
                    }
                );

                const requestResponseQueue = `/user/${authenticatedCompanyUserId}/queue/request-response`;
                requestResponseSubscriptionRef.current = websocketServices.subscribe(
                    requestResponseQueue,
                    (message) => {
                        console.log("📬 Company request response:", message);
                    }
                );

                const removalQueue = `/user/${authenticatedCompanyUserId}/queue/removal`;
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
                        // handleNotification(message);
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

    if (!usersCompany) {
        return <p>Loading...</p>;
    }

    console.log("NEEDED LOG")
    console.log(publicReports);
    console.log("NEEDED LOG")

    return (
        <div>
            <div>
                <p>{usersCompany.id}</p>
                <p>{usersCompany.name}</p>
                <p>{usersCompany.email}</p>
                <p>{usersCompany.address}</p>
                <p>{usersCompany.companyIntroduction}</p>
                <p>{usersCompany.phoneNumber}</p>
                <p>{usersCompany.overallRating}</p>
                <p>{usersCompany.serviceType}</p>
            </div>
            <br/>
            <div>
                {usersFeedbacks?.map(feedback => (
                    <div key={feedback.id}>
                        <p>{feedback.rating}</p>
                        <p>{feedback.message}</p>
                        <p>{feedback.createdAt}</p>
                        <p>{feedback.reviewerEmail}</p>
                    </div>
                ))}
            </div>
            <br/>
            <div>
                {usersBuildings?.map(building => (
                    <div key={building.id}>
                        <p>{building.address}</p>
                        <p>{building.buildingNumber}</p>
                        <p>{building.numberOfApartments}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default CompanyPage;
