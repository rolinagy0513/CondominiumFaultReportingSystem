import "./style/CompanyPage.css";
import { useCompanies } from "../../hooks/useCompanies.js";
import { useContext, useEffect } from "react";
import { CompanyPageContext } from "../../context/company/CompanyPageContext.jsx";
import { useFeedback } from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";
import websocketServices from "../../services/WebsocketServices.js";

const CompanyPage = () => {

    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const { usersCompany, usersFeedbacks, usersBuildings, authenticatedCompanyUserId, companyGroupId, companyGroupIdentifier} = useContext(CompanyPageContext);

    const { getMyCompany } = useCompanies();
    const { getFeedbacksForCompany } = useFeedback();
    const { getBuildingsByCompanyId } = useBuildings();

    const {
        getAllPublicReports
    } = useReports()

    useEffect(() => {
        getMyCompany();
    }, []);

    useEffect(() => {
        if (usersCompany?.id) {
            getFeedbacksForCompany(usersCompany.id);
            getBuildingsByCompanyId(usersCompany.id);
        }
    }, [usersCompany?.id]);

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

    if (!usersCompany) {
        return <p>Loading...</p>;
    }

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
