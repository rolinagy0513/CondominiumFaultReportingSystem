import {useContext} from "react";

import apiServices from "../services/ApiServices.js";

import {ResidentPageContext} from "../context/resident/ResidentPageContext.jsx";
import {PaginationContext} from "../context/general/PaginationContext.jsx";
import {ResidentReportContext} from "../context/resident/ResidentReportContext.jsx";
import {ResidentUserContext} from "../context/resident/ResidentUserContext.jsx";

export const useReports = () =>{

    const SHARED_API_PATH = import.meta.env.VITE_API_SHARED_REPORT_URL;

    const GET_PUBLIC_REPORTS = `${SHARED_API_PATH}/getAllPublicSubmitted`

    const{
        residentGroupId
    } = useContext(ResidentUserContext);

    const {
        setPublicReports, setInProgressReports,
        setCompletedReports,
    } = useContext(ResidentReportContext);

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

    const sendPublicReport = async(reportData) => {
        try {
            const response = await apiServices.post(
                "/api/resident/report/sendPublic",
                reportData
            );
            console.log('Report sent:', response);
            return response;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }

    const sendPrivateReport = async (selectedCompanyId ,reportData) =>{
        try{
            const response = await apiServices.post(`/api/resident/report/sendPrivate/${selectedCompanyId}`, reportData)
            console.log(`Report sent` + response);
        }catch (error){
            console.error(error.message)
        }

    }

    const getInProgressReport = async ()=>{
        try {
            const response = await apiServices.get("api/resident/report/getInProgressReport")
            setInProgressReports(response);
        }catch (error){
            console.error(error.message)
        }
    }

    const getCompletedReportsForUser = async () =>{
        try{
            const response = await apiServices.get("api/resident/report/getCompletedReportsForUser")
            setCompletedReports(response);
        }catch (error){
            console.error(error.message)
        }
    }

    return{ getAllPublicReports, sendPublicReport, sendPrivateReport, getInProgressReport, getCompletedReportsForUser}

}