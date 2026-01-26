import {useContext, useState} from "react";

import apiServices from "../services/ApiServices.js";

import {PaginationContext} from "../context/general/PaginationContext.jsx";
import {ResidentReportContext} from "../context/resident/ResidentReportContext.jsx";
import {ResidentUserContext} from "../context/resident/ResidentUserContext.jsx";
import {CompanyPageContext} from "../context/company/CompanyPageContext.jsx";

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
        setTotalElements, setCurrentPrivatePage,
        setTotalPrivatePage
    } = useContext(PaginationContext);

    const{
        companyGroupId,setPrivateReports,
        setAcceptedReports
    } = useContext(CompanyPageContext);

    const pageSize = 5;

    const getAllPublicReports = async (page = 0) =>{

        let groupId;

        if (residentGroupId) {
            groupId = residentGroupId;
            console.log("📋 Fetching as resident with groupId:", groupId);
        } else if (companyGroupId) {
            groupId = companyGroupId;
            console.log("🏢 Fetching as company with groupId:", groupId);
        } else {
            console.error("No group ID available in any context");
            setPublicReports([]);
            setCurrentPage(0);
            setTotalPages(0);
            setTotalElements(0);
            return;
        }

        try{
            const params = new URLSearchParams({
                groupId: groupId.toString(),
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

    const getPrivateReportsForCompany = async (page = 0, companyId) =>{
        try {
            const params = new URLSearchParams({
                companyId: companyId.toString(),
                page: page.toString(),
                size: pageSize.toString(),
                sortBy: 'id',
                direction: 'ASC'
            });

            const response = await apiServices.get(`api/company/report/getAllPrivateSubmitted?${params.toString()}`);

            if (response && response.content) {
                setPrivateReports(response.content);
                setCurrentPrivatePage(response.number);
                setTotalPrivatePage(response.totalPages);
            } else {
                setPrivateReports([]);
                setCurrentPrivatePage(0);
                setTotalPrivatePage(0);
            }

        }catch (error){
            console.error(error.message);
        }
    }

    const acceptReport = async (reportId, companyId, currentPublicPage, currentPrivatePage) => {
        console.log("IDE");
        console.log(reportId);
        console.log(companyId);

        const data = {
            reportId: reportId,
            companyId: companyId
        };

        try {
            const response = await apiServices.put("api/company/report/acceptReport", data);
            console.log("Response: " + response);

            await getPrivateReportsForCompany(currentPrivatePage, companyId);

            await getAcceptedReportsForCompany(companyId);

            await getAllPublicReports(currentPublicPage);

            return response;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    };

    const getAcceptedReportsForCompany = async (companyId) =>{

        try {
            const response = await apiServices.get(`api/company/report/getAcceptedReports/${companyId}`)
            setAcceptedReports(response);
        }catch (error){
            console.error(error.message);
        }

    }

    const completeReport = async (reportId, companyId, cost) =>{

            const params = new URLSearchParams({
                reportId: reportId.toString(),
                companyId: companyId.toString(),
                cost: cost.toString(),
            });

        try {
            const response = await apiServices.put(`api/company/report/completeReport?${params.toString()}`)
            alert("Report has been completed")
        }catch (error){
            console.error(error.message);
        }

    }

    return{
        getAllPublicReports, sendPublicReport,
        sendPrivateReport, getInProgressReport,
        getCompletedReportsForUser, getPrivateReportsForCompany,
        acceptReport, getAcceptedReportsForCompany,
        completeReport
    }

}