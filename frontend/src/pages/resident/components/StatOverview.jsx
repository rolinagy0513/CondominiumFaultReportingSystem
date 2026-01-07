import {useContext} from "react";

import {FaBuilding, FaChartBar, FaHome} from "react-icons/fa";
import {MdPeople} from "react-icons/md";

import {ResidentApartmentContext} from "../../../context/resident/ResidentApartmentContext.jsx";
import {ResidentBuildingContext} from "../../../context/resident/ResidentBuildingContext.jsx";
import {ResidentCompanyContext} from "../../../context/resident/ResidentCompanyContext.jsx";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/StatOverview.css"

const StatOverview = () =>{

    // const {
    //     ownersApartment, ownersBuilding,
    //     companiesInBuilding, publicReports,
    // } = useContext(ResidentPageContext);

    const {
        ownersApartment
    } = useContext(ResidentApartmentContext);

    const {
        ownersBuilding
    } = useContext(ResidentBuildingContext);

    const {
        companiesInBuilding
    } = useContext(ResidentCompanyContext);

    const {
        publicReports
    } = useContext(ResidentReportContext);

    return(
        <div className="resident-page-stats-overview">
            <div className="resident-page-stat-card">
                <div className="resident-page-stat-icon">
                    <FaHome />
                </div>
                <div className="resident-page-stat-info">
                    <h3>My Apartment</h3>
                    <p>{ownersApartment?.apartmentNumber || "N/A"}</p>
                </div>
            </div>
            <div className="resident-page-stat-card">
                <div className="resident-page-stat-icon">
                    <FaBuilding />
                </div>
                <div className="resident-page-stat-info">
                    <h3>Building</h3>
                    <p>{ownersBuilding?.buildingNumber || "N/A"}</p>
                </div>
            </div>
            <div className="resident-page-stat-card">
                <div className="resident-page-stat-icon">
                    <MdPeople />
                </div>
                <div className="resident-page-stat-info">
                    <h3>Service Companies</h3>
                    <p>{companiesInBuilding?.length || 0}</p>
                </div>
            </div>
            <div className="resident-page-stat-card">
                <div className="resident-page-stat-icon">
                    <FaChartBar />
                </div>
                <div className="resident-page-stat-info">
                    <h3>Active Reports</h3>
                    <p>{publicReports?.length || 0}</p>
                </div>
            </div>
        </div>
    )

}

export default StatOverview;