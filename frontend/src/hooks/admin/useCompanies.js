import apiServices from "../../services/ApiServices.js";
import websocketServices from "../../services/WebsocketServices.js";

export const useCompanies = (
    GET_ALL_COMPANY_URL, GET_PENDING_COMPANY_REQUEST_URL, SEND_COMPANY_RESPONSE, REMOVE_COMPANY,
    pageSize, setCompanies, setCompaniesCurrentPage, setCompaniesTotalPages, setCompaniesTotalElements,
    setCompanyRequests, setCurrentView, setLoadingCompanies, setTargetId, setIsRemovalModalOpen,
    setModalTitleText, setModalText, setModalButtonText
) =>{

    const getCompanies = async (page = 0) => {
        setLoadingCompanies(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_ALL_COMPANY_URL}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setCompanies(response.content);
                setCompaniesCurrentPage(response.number);
                setCompaniesTotalPages(response.totalPages);
                setCompaniesTotalElements(response.totalElements);
            } else {
                setCompanies([]);
                setCompaniesCurrentPage(0);
                setCompaniesTotalPages(0);
                setCompaniesTotalElements(0);
            }

            setCurrentView('companies');
        } catch (error) {
            console.error("Error fetching companies:", error.message);
            setCompanies([]);
            setCompaniesCurrentPage(0);
            setCompaniesTotalPages(0);
            setCompaniesTotalElements(0);
        } finally {
            setLoadingCompanies(false);
        }
    }

    const handleGetPendingCompanyRequests = async() =>{

        try {

            const response = await apiServices.get(GET_PENDING_COMPANY_REQUEST_URL)

            setCompanyRequests(response || [])

        }catch (error){
            console.error(error.message)
        }

    }

    const handleAcceptCompanyRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'ACCEPTED'
        })

        const success = websocketServices.sendMessage(
            SEND_COMPANY_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Accepted company request ID: ${requestId}`);
            setCompanyRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send acceptance via WebSocket');
        }

    };

    const handleRejectCompanyRequest = (requestId) => {

        const responseData = ({
            requestId:requestId,
            status:'REJECTED'
        })

        const success = websocketServices.sendMessage(
            SEND_COMPANY_RESPONSE,
            responseData
        );

        if (success) {
            console.log(`Rejected company request ID: ${requestId}`);
            setCompanyRequests(prev => prev.filter(request => request.requestId !== requestId));
            setCurrentView("buildings")
        } else {
            console.error('Failed to send reluctance via WebSocket');
        }

    };

    const handleRemoveCompanyFromSystem = (companyId) =>{

        const responseData = ({
            targetId: companyId
        })

        const success = websocketServices.sendMessage(
            REMOVE_COMPANY,responseData
        )

        if (success){
            console.log(`Removed company with the id of: ${companyId}`)

            setTargetId(null);
            setIsRemovalModalOpen(false);
            setModalTitleText("")
            setModalText("")
            setModalButtonText("")
            setCurrentView("buildings")

        }else {
            console.error("Failed to remove company")
        }

    }

    return{getCompanies, handleGetPendingCompanyRequests, handleAcceptCompanyRequest, handleRejectCompanyRequest, handleRemoveCompanyFromSystem}

}