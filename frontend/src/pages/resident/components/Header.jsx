import {IoMdNotifications} from "react-icons/io";
import {IoLogOut} from "react-icons/io5";
import {useContext} from "react";

import {ResidentPageContext} from "../../../context/resident/ResidentPageContext.jsx";

import "./components-styles/Header.css"

const Header = ({handleLogout}) =>{

    const {authenticatedResidentUserName} = useContext(ResidentPageContext);

     return(
         <div className="resident-page-header">
             <div className="resident-page-header-left">
                 <h2>Resident Dashboard</h2>
                 <p className="resident-page-welcome-text">Welcome back, {authenticatedResidentUserName || "Resident"}</p>
             </div>
             <div className="resident-page-header-right">
                 <button className="resident-page-header-action-btn resident-page-notification-btn">
                     <IoMdNotifications className="resident-page-header-icon" />
                     <span className="resident-page-notification-badge">3</span>
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