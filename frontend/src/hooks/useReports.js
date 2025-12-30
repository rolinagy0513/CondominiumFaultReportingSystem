import {useContext} from "react";

import apiServices from "../services/ApiServices.js";

import {ResidentPageContext} from "../context/resident/ResidentPageContext.jsx";
import {PaginationContext} from "../context/general/PaginationContext.jsx";

export const useReports = () =>{

    const SHARED_API_PATH = import.meta.env.VITE_API_SHARED_REPORT_URL;

    const GET_PUBLIC_REPORTS = `${SHARED_API_PATH}/getAllPublicSubmitted`

    const {
        setPublicReports, residentGroupId
    } = useContext(ResidentPageContext);

    const {
        setCurrentPage, setTotalPages,
        setTotalElements, pageSize
    } = useContext(PaginationContext);

    const getAllPublicReports = async (page = 0) =>{

        if (!residentGroupId) {
            console.error("residentGroupId is not available");
            setPublicReports([]);
            setCurrentPage(0);
            setTotalPages(0);
            setTotalElements(0);
            return;
        }

        try{
            const params = new URLSearchParams({
                groupId: residentGroupId.toString(),
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const url = `${GET_PUBLIC_REPORTS}?${params.toString()}`;
            const response = await apiServices.get(url);

            if (response && response.content) {
                setPublicReports(response.content);
                setCurrentPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } else {
                setPublicReports([]);
                setCurrentPage(0);
                setTotalPages(0);
                setTotalElements(0);
            }

        }catch (error){
            console.error("Error fetching public reports:", error.message);
            setPublicReports([]);
            setCurrentPage(0);
            setTotalPages(0);
            setTotalElements(0);
        }

    }

    return{ getAllPublicReports }

}