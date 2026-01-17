import "./style/CompanyPage.css";
import { useCompanies } from "../../hooks/useCompanies.js";
import { useContext, useEffect } from "react";
import { CompanyPageContext } from "../../context/company/CompanyPageContext.jsx";
import { useFeedback } from "../../hooks/useFeedback.js";
import {useBuildings} from "../../hooks/useBuildings.js";
import {useReports} from "../../hooks/useReports.js";

const CompanyPage = () => {

    const { usersCompany, usersFeedbacks, usersBuildings } = useContext(CompanyPageContext);

    const { getMyCompany } = useCompanies();
    const { getFeedbacksForCompany } = useFeedback();
    const { getBuildingsByCompanyId } = useBuildings();

    const {
        getAllPublicReports
    } = useReports()

    useEffect(() => {
        getMyCompany();
    }, []);

    useEffect(() => {
        if (usersCompany?.id) {
            getFeedbacksForCompany(usersCompany.id);
            getBuildingsByCompanyId(usersCompany.id);
        }
    }, [usersCompany?.id]);

    if (!usersCompany) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div>
                <p>{usersCompany.id}</p>
                <p>{usersCompany.name}</p>
                <p>{usersCompany.email}</p>
                <p>{usersCompany.address}</p>
                <p>{usersCompany.companyIntroduction}</p>
                <p>{usersCompany.phoneNumber}</p>
                <p>{usersCompany.overallRating}</p>
                <p>{usersCompany.serviceType}</p>
            </div>
            <br/>
            <div>
                {usersFeedbacks?.map(feedback => (
                    <div key={feedback.id}>
                        <p>{feedback.rating}</p>
                        <p>{feedback.message}</p>
                        <p>{feedback.createdAt}</p>
                        <p>{feedback.reviewerEmail}</p>
                    </div>
                ))}
            </div>
            <br/>
            <div>
                {usersBuildings?.map(building => (
                    <div key={building.id}>
                        <p>{building.address}</p>
                        <p>{building.buildingNumber}</p>
                        <p>{building.numberOfApartments}</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default CompanyPage;
