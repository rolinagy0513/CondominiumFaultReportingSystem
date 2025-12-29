import apiServices from "../services/ApiServices.js";
import websocketServices from "../services/WebsocketServices.js";

import {CompanyContext} from "../context/admin/CompanyContext.jsx";
import {AdminPanelContext} from "../context/admin/AdminPanelContext.jsx";
import {PaginationContext} from "../context/general/PaginationContext.jsx";
import {AdminModalContext} from "../context/admin/AdminModalContext.jsx";

import {useContext} from "react";
import {ResidentPageContext} from "../context/resident/ResidentPageContext.jsx";

export const useCompanies = () =>{

    const ADMIN_COMPANY_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_URL
    const RESIDENT_COMPANY_API_PATH = import.meta.env.VITE_API_RESIDENT_COMPANY_URL
    const ADMIN_COMPANY_REQUEST_API_PATH = import.meta.env.VITE_API_ADMIN_COMPANY_REQUEST_URL
    const SEND_COMPANY_RESPONSE = import.meta.env.VITE_API_ADMIN_WEBSOCKET_COMPANY_REQUEST_RESPONSE_DESTINATION
    const REMOVE_COMPANY = import.meta.env.VITE_ADMIN_WEBSOCKET_COMPANY_REMOVE_DESTINATION

    const GET_PENDING_COMPANY_REQUEST_URL = `${ADMIN_COMPANY_REQUEST_API_PATH}/getPendingRequests`
    const GET_ALL_COMPANY_URL = `${ADMIN_COMPANY_API_PATH}/getAll`
    const GET_COMPANIES_IN_BUILDING_URL = `${RESIDENT_COMPANY_API_PATH}/getByBuildingId`

    const{
        setCompanies, setLoadingCompanies,
        setCompaniesCurrentPage, setCompaniesTotalPages,
        setCompaniesTotalElements
    } = useContext(CompanyContext);

    const {
        setCurrentView
    } = useContext(AdminPanelContext);

    const {
        pageSize
    } = useContext(PaginationContext);

    const {
        setIsRemovalModalOpen, setCompanyRequests,
        setTargetId, setModalText,
        setModalButtonText,setModalTitleText
    } = useContext(AdminModalContext);

    const {
        ownersBuildingId,setCompaniesInBuilding
    } = useContext(ResidentPageContext);

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

    const getCompanyByBuildingId = async () =>{

        try {
            const response = await apiServices.get(`${GET_COMPANIES_IN_BUILDING_URL}/${ownersBuildingId}`)
            setCompaniesInBuilding(response);
        }catch (error){
            console.error(error.message);
        }

    }

    return{
        getCompanies, handleGetPendingCompanyRequests,
        handleAcceptCompanyRequest, handleRejectCompanyRequest,
        handleRemoveCompanyFromSystem, getCompanyByBuildingId
    }

}