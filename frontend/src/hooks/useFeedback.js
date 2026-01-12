import apiServices from "../services/ApiServices.js";

export const useFeedback = () =>{

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

    return {sendFeedback}

}