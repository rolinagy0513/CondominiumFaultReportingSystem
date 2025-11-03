import React from "react";
import {Route, Routes} from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx"
import ChooseRole from "../pages/role-selection/ChooseRole.jsx";
import AdminPanel from "../pages/admin/AdminPanel.jsx";

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