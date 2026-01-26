import apiServices from "../services/ApiServices.js";
import websocketServices from "../services/WebsocketServices.js";

import {ApartmentContext} from "../context/admin/ApartmentContext.jsx";
import {PaginationContext} from "../context/general/PaginationContext.jsx";
import {AdminModalContext} from "../context/admin/AdminModalContext.jsx";
import {BuildingContext} from "../context/admin/BuildingContext.jsx";
import {AdminPanelContext} from "../context/admin/AdminPanelContext.jsx";

import {useContext} from "react";
import {ResidentPageContext} from "../context/resident/ResidentPageContext.jsx";
import {ResidentApartmentContext} from "../context/resident/ResidentApartmentContext.jsx";

export const useApartments = (
) =>{

    const APARTMENT_BASE_API_PATH =import.meta.env.VITE_API_BASE_APARTMENT_URL;
    const RESIDENT_APARTMENT_API_PATH = import.meta.env.VITE_API_RESIDENT_APARTMENT_URL
    const ADMIN_APARTMENT_API_PATH = import.meta.env.VITE_API_ADMIN_APARTMENT_URL

    const ADMIN_APARTMENT_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_APARTMENT_REQUEST_URL

    const SEND_APARTMENT_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_APARTMENT_REQUEST_RESPONSE_DESTINATION
    const REMOVE_RESIDENT = import.meta.env.VITE_API_ADMIN_WEBSOCKET_RESIDENT_REMOVE_DESTINATION

    const ASSIGN_OWNER_URL = `${ADMIN_APARTMENT_API_PATH}/addUserToApartment`;
    const GET_APARTMENT_URL = `${RESIDENT_APARTMENT_API_PATH}/getByBuildingId`;
    const GET_PENDING_APARTMENT_REQUEST_URL = `${ADMIN_APARTMENT_REQUEST_API_PATH}/getPendingRequests`
    const GET_AVAILABLE_APARTMENTS_URL = `${APARTMENT_BASE_API_PATH}/getAvailableByBuildingId`;
    const GET_OWNER_APARTMENT_URL = `${RESIDENT_APARTMENT_API_PATH}/getByOwnerId`;

    const{
        setApartments,
        setLoadingApartments
    } = useContext(ApartmentContext);

    const {
        currentPage, setCurrentPage,
        setTotalPages, setTotalElements, pageSize
    } = useContext(PaginationContext);

    const {
        setIsRemovalModalOpen,setApartmentRequests,
        setTargetId,setModalText,
        setModalButtonText,setModalTitleText
    } = useContext(AdminModalContext);

    const{
        buildings, selectedBuilding,
        setSelectedBuilding
    } = useContext(BuildingContext);

    const {
        setCurrentView
    } = useContext(AdminPanelContext);

    const {
        setOwnersApartment,
        setOwnersApartmentId
    } = useContext(ResidentApartmentContext);

    const getApartments = async(buildingId, page = 0) => {
        setLoadingApartments(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_APARTMENT_URL}/${buildingId}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setApartments(response.content);
                setCurrentPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setApartments([]);
                setCurrentPage(0);
                setTotalPages(0);
                setTotalElements(0);
            }

            const building = buildings.find(b => b.id === buildingId);
            setSelectedBuilding(building);
            setCurrentView('apartments');

        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const handleGetPendingApartmentRequests = async () =>{
        try {
            const response = await apiServices.get(GET_PENDING_APARTMENT_REQUEST_URL)
            setApartmentRequests(response || []);

        }catch (error){
            console.error(error.message)
        }

    }

    const handleAcceptApartmentRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'ACCEPTED'
        })

        const success = websocketServices.sendMessage(
            SEND_APARTMENT_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Accepted apartment request ID: ${requestId}`);
            setApartmentRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send acceptance via WebSocket');
        }

    };

    const handleRejectApartmentRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'REJECTED'
        })

        const success = websocketServices.sendMessage(
            SEND_APARTMENT_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Rejected apartment request ID: ${requestId}`);
            setApartmentRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send reluctance via WebSocket');
        }

    };

    const handleRemoveResidentFromApartment = (apartmentId) =>{

        const responseData = ({
            targetId: apartmentId
        })

        const success = websocketServices.sendMessage(
            REMOVE_RESIDENT,responseData
        );

        if (success) {
            console.log(`The resident has benn successfully removed from the apartment with the id of: ${apartmentId}`);

            setTargetId(null);
            setIsRemovalModalOpen(false);
            setModalText("");
            setModalButtonText("")
            setModalTitleText("")
            setCurrentView("buildings");


        } else {
            console.error('Failed to remove the user');
        }

    }

    const getAvailableApartmentsInBuilding = async(buildingId, page = 0) => {
        setLoadingApartments(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_AVAILABLE_APARTMENTS_URL}/${buildingId}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setApartments(response.content);
                setCurrentPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setApartments([]);
                setCurrentPage(0);
                setTotalPages(0);
                setTotalElements(0);
            }

            const building = buildings.find(b => b.id === buildingId);
            setSelectedBuilding(building);

        } catch (error) {
            console.error("Error fetching apartments:", error.message);
            setApartments([]);
            setCurrentPage(0);
            setTotalPages(0);
        } finally {
            setLoadingApartments(false);
        }
    }

    const handleAssignOwner = async (apartmentId, userEmail) => {
        try {
            const requestData = {
                apartmentId: apartmentId,
                userEmail: userEmail
            };

            await apiServices.post(ASSIGN_OWNER_URL, requestData);
            setCurrentView("buildings");
            console.log(`Successfully assigned owner to apartment ${apartmentId}`);

        } catch (error) {
            console.error("Error assigning owner:", error.message);
            alert(error.message);
            return false;
        }
    }

    const handleGetApartmentByOwnerId = async () => {

        try{
            const response = await apiServices.get(GET_OWNER_APARTMENT_URL);
            setOwnersApartment(response);
            setOwnersApartmentId(response.id);

        }catch (error){
            console.error("Error retrieving the owners apartment: ", error.message)
        }
    }

    return{
        getApartments, handleGetPendingApartmentRequests,
        handleAcceptApartmentRequest, handleRejectApartmentRequest,
        handleRemoveResidentFromApartment, getAvailableApartmentsInBuilding,
        handleAssignOwner, handleGetApartmentByOwnerId
    }

}