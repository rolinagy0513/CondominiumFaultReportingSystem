import React from "react";
import {Route, Routes} from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx"
import ChooseRole from "../pages/role-selection/ChooseRole.jsx";
import AdminPanel from "../pages/admin/AdminPanel.jsx";
import ResidentRequest from "../pages/role-selection/ResidentRequest.jsx"
import CompanyRequest from "../pages/role-selection/CompanyRequest.jsx"
import ResidentPage from "../pages/resident/ResidentPage.jsx";
import CompanyPage from "../pages/company/CompanyPage.jsx";

export const AuthRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>
        </Routes>
    )
}

export const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/choose-role" element={<ChooseRole/>}/>
            <Route path="/resident-request" element={<ResidentRequest/>}/>
            <Route path="/company-request" element={<CompanyRequest/>}/>
            <Route path="/resident-page" element={<ResidentPage/>}/>
            <Route path="/company-page" element={<CompanyPage/>}/>
        </Routes>
    )
}

export const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/admin-panel" element={<AdminPanel/>}/>
        </Routes>
    )
}