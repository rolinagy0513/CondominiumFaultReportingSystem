import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

export const useApartments = (
    GET_APARTMENT_URL, GET_PENDING_APARTMENT_REQUEST_URL, SEND_APARTMENT_RESPONSE, REMOVE_RESIDENT,
    pageSize, currentPage, setLoadingApartments, setApartments, setCurrentPage, setTotalPages,
    setTotalElements, buildings, setSelectedBuilding, setCurrentView, setApartmentRequests,
    selectedBuilding, setTargetId, setIsRemovalModalOpen, setModalText, setModalButtonText, setModalTitleText
) =>{

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

            if (selectedBuilding) {
                getApartments(selectedBuilding.id, currentPage);
            }

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

    return{getApartments, handleGetPendingApartmentRequests, handleAcceptApartmentRequest, handleRejectApartmentRequest, handleRemoveResidentFromApartment}

}