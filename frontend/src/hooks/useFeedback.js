import apiServices from "../services/ApiServices.js";
import {useContext} from "react";
import {CompanyPageContext} from "../context/company/CompanyPageContext.jsx";

export const useFeedback = () =>{

    const { setUsersFeedbacks } = useContext(CompanyPageContext);

    const sendFeedback = async (reportId,rating, message) =>{

        const data = {
            reportId : reportId,
            rating : rating,
            message : message,
        }

        try {
            const response  = await apiServices.post("/api/resident/feedback/giveFeedback",data)
            console.log(response)
            alert("Thank you for your feedback!");
        }catch (error){
            alert(error.message)
        }

    }

    const getFeedbacksForCompany = async (companyId) =>{

        try {
            const response = await apiServices.get(`api/company/feedback/getFeedbacksForCompany/${companyId}`)
            setUsersFeedbacks(response)
        }catch (error){
            console.error(error.message);
        }

    }

    return {sendFeedback, getFeedbacksForCompany}

}