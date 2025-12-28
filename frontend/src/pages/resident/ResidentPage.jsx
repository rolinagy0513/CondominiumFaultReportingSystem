import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import {ResidentPageContext} from "../../context/resident/ResidentPageContext.jsx";

const ResidentPage = () => {

    const navigate = useNavigate();

    const RESIDENT_APARTMENT_API_PATH = import.meta.env.VITE_API_RESIDENT_APARTMENT_URL;
    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const GET_OWNER_APARTMENT_URL = `${RESIDENT_APARTMENT_API_PATH}/getByOwnerId`;
    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        ownersApartment, setOwnersApartment,
        residentGroupId, setResidentGroupId,
        authenticatedResidentId, setAuthenticatedResidentId,
        authenticatedResidentUserName, setAuthenticatedResidentUserName
    } = useContext(ResidentPageContext);

    console.log(residentGroupId, authenticatedResidentId, authenticatedResidentUserName)

    const subscriptionRef = useRef(null);

    useEffect(() => {
        handleGetApartmentByOwnerId();
    }, []);

    useEffect(() => {
        if (!residentGroupId) {
            console.log("⚠️ No residentGroupId, skipping WebSocket setup");
            return;
        }

        websocketServices.connect(SOCK_URL, {
            onConnect: () => {
                console.log("✅ Resident WebSocket connected successfully");

                const topic = `/topic/group/${residentGroupId}`;

                subscriptionRef.current = websocketServices.subscribe(
                    topic,
                    handleNotification
                );

                if (subscriptionRef.current) {
                    console.log("✅ Successfully subscribed to resident group notifications");
                } else {
                    console.error("❌ Failed to subscribe");
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
            console.log("🧹 Cleaning up Resident WebSocket subscriptions...");

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }

            websocketServices.disconnect();
        };
    }, [residentGroupId]);

    const handleNotification = (notification) => {
        console.log("📬 Resident received notification:", notification);

        // TODO: Add subscription handlers here based on notification type
        // Example structure:
        // if (notification.type === 'SOME_NOTIFICATION_TYPE') {
        //     // Handle specific notification type
        // }
    };

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

    console.log(`This is the owners apartments id: ${ownersApartment.id}`);
    console.log(`This is the owners apartments number: ${ownersApartment.apartmentNumber}`)


    const handleGetApartmentByOwnerId = async () => {

        try{
            const response = await apiServices.get(GET_OWNER_APARTMENT_URL);
            setOwnersApartment(response);
            console.log("The owners apartment was successfully retrieved")
            console.log(response)

        }catch (error){
            console.error("Error retrieving the owners apartment: ", error.message)
        }
    }

    return(
        <div>
            <p>Resident Page</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default ResidentPage;