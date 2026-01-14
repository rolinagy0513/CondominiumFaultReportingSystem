import {useContext, useState} from "react";

import {IoLogOut} from "react-icons/io5";

import {ResidentUserContext} from "../../../context/resident/ResidentUserContext.jsx";
import {ResidentReportContext} from "../../../context/resident/ResidentReportContext.jsx";

import "./components-styles/Header.css"

const Header = ({handleLogout}) =>{

    const {authenticatedResidentUserName} = useContext(ResidentUserContext);
    const {setCompleteReportModalOpen} = useContext(ResidentReportContext);

     return(
         <div className="resident-page-header">
             <div className="resident-page-header-left">
                 <h2>Resident Dashboard</h2>
                 <p className="resident-page-welcome-text">Welcome back, {authenticatedResidentUserName || "Resident"}</p>
             </div>
             <div className="resident-page-header-middle">
                 <h1>HomeLink 🏢</h1>

             </div>
             <div className="resident-page-header-right">

                 <button className="resident-page-header-completeReport-btn" onClick={()=> setCompleteReportModalOpen(true)}>
                     Completed Reports
                 </button>

                 <button
                     className="resident-page-header-action-btn resident-page-logout-btn"
                     onClick={handleLogout}
                 >
                     <IoLogOut className="resident-page-header-icon" />
                     Logout
                 </button>

             </div>
         </div>
     )

}

export default Header;