import {useContext, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";

import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

import {ResidentPageContext} from "../../context/resident/ResidentPageContext.jsx";
import {useApartments} from "../../hooks/useApartments.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useCompanies} from "../../hooks/useCompanies.js";

const ResidentPage = () => {

    const navigate = useNavigate();

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const SOCK_URL = import.meta.env.VITE_API_WEBSOCKET_BASE_URL;

    const LOGOUT_URL = `${AUTH_API_PATH}/logout`;

    const {
        ownersApartment, residentGroupId,
        authenticatedResidentId, authenticatedResidentUserName,
        ownersApartmentId, ownersBuilding, ownersBuildingId,companiesInBuilding
    } = useContext(ResidentPageContext);

    const {
        handleGetApartmentByOwnerId
    } = useApartments();

    const{
        getBuildingByApartmentId
    } = useBuildings()

    const{
        getCompanyByBuildingId
    } = useCompanies()

    console.log(ownersApartmentId)
    console.log(residentGroupId, authenticatedResidentId, authenticatedResidentUserName)

    console.log(ownersBuilding)

    const subscriptionRef = useRef(null);

    useEffect(() => {
        handleGetApartmentByOwnerId();
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

    return(
        <div>
            <p>Resident Page</p>
            <button onClick={handleLogout}>Logout</button>

            <div className="residentPage-apartment-info">
                <h2>Apartment Information</h2>

                {ownersApartment ? (
                    <div>
                        <p><strong>Apartment ID:</strong> {ownersApartment.id}</p>
                        <p><strong>Apartment Number:</strong> {ownersApartment.apartmentNumber}</p>
                        <p><strong>Floor:</strong> {ownersApartment.floorNumber}</p>
                    </div>
                ) : (
                    <p>Loading apartment information...</p>
                )}
            </div>

            <br></br>

            <div className="residentPage-building-info">
                <h2>Building Information</h2>

                {ownersBuilding ? (
                    <div>
                        <p><strong>Building ID:</strong> {ownersBuilding.id}</p>
                        <p><strong>Building Number:</strong> {ownersBuilding.buildingNumber}</p>
                        <p><strong>Building Address:</strong> {ownersBuilding.address}</p>
                        <p><strong>Number of apartments in the building:</strong>{ownersBuilding.numberOfApartments}</p>
                    </div>
                ) : (
                    <p>Loading building information...</p>
                )}
            </div>

            <br></br>

            <div className="residentPage-companies-info">
                <h2>Companies in Building</h2>

                {companiesInBuilding && companiesInBuilding.length > 0 ? (
                    <div className="residentPage-companies-list">
                        {companiesInBuilding.map((company) => (
                            <div key={company.id} className="residentPage-company-card">
                                <h3>{company.name}</h3>
                                <p><strong>Service Type:</strong> {company.serviceType}</p>
                                <p><strong>Email:</strong> {company.email}</p>
                                <p><strong>Phone:</strong> {company.phoneNumber}</p>
                                <p><strong>Address:</strong> {company.address}</p>
                                <p><strong>Rating:</strong> {company.overallRating || 'Not rated'}</p>
                                <p><strong>Introduction:</strong> {company.companyIntroduction || 'No introduction available'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No companies present in the building</p>
                )}
            </div>

        </div>
    );
};

export default ResidentPage;