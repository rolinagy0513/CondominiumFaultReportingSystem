import {IoLogOut} from "react-icons/io5";
import {useContext} from "react";

import {CompanyPageContext} from "../../../context/company/CompanyPageContext.jsx";

import "./component-styles/Header.css"

const Header = ({handleLogout}) =>{

    const {
        usersCompany
    } = useContext(CompanyPageContext);


    return(
        <header className="company-page-header">
            <div className="company-page-header-left">
                <h2>Company Dashboard</h2>
                <p className="company-page-company-tagline"> Welcome back, {usersCompany.name}</p>
            </div>

            <div className="company-page-header-middle">
                <h1 className="company-page-title">
                    HomeLink
                    <span className="company-page-title-icon">🏢</span>
                </h1>
            </div>

            <div className="company-page-header-right">
                <button className="company-page-header-action-btn company-page-logout-btn" onClick={()=> handleLogout()}>
                    <span className="company-page-header-icon"></span>
                    Logout  <IoLogOut className="resident-page-header-icon" />
                </button>
            </div>
        </header>
    )

}

export default Header;