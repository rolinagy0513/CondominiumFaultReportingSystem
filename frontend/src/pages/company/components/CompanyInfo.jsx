import {useContext} from "react";
import { CiEdit } from "react-icons/ci";
import {getServiceTypeDisplay} from "../../../utility/GetCompanyLogoUtility.jsx";
import {CompanyPageContext} from "../../../context/company/CompanyPageContext.jsx";
import "./component-styles/CompanyInfo.css"

const CompanyInfo = () =>{
    const {usersCompany, setIsEditModalOpen} = useContext(CompanyPageContext);

    return(
        <div className="company-page-info-section">
            <button className="company-page-edit-button" onClick={() => setIsEditModalOpen(true)}>
                <CiEdit/>
                <span>Edit company details</span>
            </button>
            <h2 className="company-page-company-name">{usersCompany.name}</h2>
            <div className="company-page-info-grid">
                <div className="company-page-info-item">
                    <span className="company-page-info-label">Contact Email:</span>
                    <span className="company-page-info-value">{usersCompany.email}</span>
                </div>
                <div className="company-page-info-item">
                    <span className="company-page-info-label">Address:</span>
                    <span className="company-page-info-value">{usersCompany.address}</span>
                </div>
                <div className="company-page-info-item">
                    <span className="company-page-info-label">Phone:</span>
                    <span className="company-page-info-value">{usersCompany.phoneNumber}</span>
                </div>
                <div className="company-page-info-item">
                    <span className="company-page-info-label">Service Type:</span>
                    <span className="company-page-info-value">{getServiceTypeDisplay(usersCompany.serviceType)}</span>
                </div>
                <div className="company-page-info-item">
                    <span className="company-page-info-label">Overall Rating:</span>
                    <span className="company-page-info-value">
                        {usersCompany.overallRating ? ` ${usersCompany.overallRating.toFixed(1)}/5⭐` : 'Not rated yet'}
                    </span>
                </div>
            </div>
            <div className="company-page-description">
                <h3>About Us</h3>
                <p>{usersCompany.companyIntroduction}</p>
            </div>
        </div>
    )
}

export default CompanyInfo