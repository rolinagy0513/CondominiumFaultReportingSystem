import React, {useContext, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import apiServices from "../../services/ApiServices.js";

import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AuthContext} from "../../context/auth/AuthContext.jsx";
import {UserContext} from "../../context/general/UserContext.jsx";

import AuthForm from "./components/AuthForm.jsx";
import loginImage from "../../assets/building.png";

import "./styles/Login.css"
import {RoleSelectionContext} from "../../context/role-selection/RoleSelectionContext.jsx";

const Login = () =>{

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const LOGIN_URL = `${AUTH_API_PATH}/authenticate`;

    const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE_STRING;
    const COMPANY_ROLE = import.meta.env.VITE_COMPANY_ROLE_STRING;
    const RESIDENT_ROLE = import.meta.env.VITE_RESIDENT_ROLE_STRING;
    const USER_ROLE = import.meta.env.VITE_USER_ROLE_STRING;

    const navigate = useNavigate();

    const { message, setMessage, isLoading, setIsLoading } = useContext(FeedbackContext);
    const { loginFormData, setLoginFormData} = useContext(AuthContext);
    const { setAuthenticatedUserId, setAuthenticatedUserName } = useContext(UserContext);
    const {setShowPendingView} = useContext(RoleSelectionContext);

    const resetForm = () =>{
        setLoginFormData({
            email: '',
            password: ''
        })
    }

    const clearAllUserData = () => {
        console.log('🧹 [LOGIN] Clearing all user data from localStorage and context');

        localStorage.removeItem("authenticatedUserId");
        localStorage.removeItem("authenticatedUserName");
        localStorage.removeItem("adminGroupId");
        localStorage.removeItem("authenticatedAdminId");
        localStorage.removeItem("authenticatedAdminUserName");
        localStorage.removeItem("residentGroupId");
        localStorage.removeItem("authenticatedResidentId");
        localStorage.removeItem("authenticatedResidentUserName");
        localStorage.removeItem("companyGroupId");
        localStorage.removeItem("authenticatedCompanyUserId");
        localStorage.removeItem("authenticatedCompanyUserName");

        if (setAuthenticatedUserId) {
            setAuthenticatedUserId(null);
        }
        if (setAuthenticatedUserName) {
            setAuthenticatedUserName(null);
        }

        console.log('✅ [LOGIN] All user data cleared');
    };

    useEffect(() => {
        console.log('🔄 [LOGIN] Login component mounted');
        clearAllUserData();
        resetForm();
        console.log('🔌 [LOGIN] Forcing WebSocket disconnect on login page');
    }, []);

    const handleInputChange = (e) => {
        setMessage("");
        const { name, value } = e.target;
        setLoginFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e)=>{

        e.preventDefault();
        setMessage('');
        setIsLoading(true)

        try{
            console.log('🔐 [LOGIN] Attempting login...');

            const response = await apiServices.post(LOGIN_URL,loginFormData);

            console.log('✅ [LOGIN] Login response received:', response);
            console.log('✅ [LOGIN] User role:', response.role);
            console.log('✅ [LOGIN] User ID:', response.user.id);
            console.log('✅ [LOGIN] Group ID:', response.groupId);

            resetForm()

            if (response.role === ADMIN_ROLE && response.groupId){
                localStorage.setItem("adminGroupId",response.groupId);
                localStorage.setItem("authenticatedAdminId",response.user.id);
                localStorage.setItem("authenticatedAdminUserName",response.user.userName);

                console.log("📊 [LOGIN] Admin login - stored data:");
                console.log("  - adminGroupId:", localStorage.getItem("adminGroupId"));
                console.log("  - authenticatedAdminId:", localStorage.getItem("authenticatedAdminId"));
                console.log("  - authenticatedAdminUserName:", localStorage.getItem("authenticatedAdminUserName"));

                navigate("/admin-panel")
            }

            if (response.role === RESIDENT_ROLE){
                localStorage.setItem("residentGroupId",response.groupId);
                localStorage.setItem("authenticatedResidentId",response.user.id);
                localStorage.setItem("authenticatedResidentUserName",response.user.userName);

                console.log("📊 [LOGIN] Resident login - stored data:");
                console.log("  - residentGroupId:", localStorage.getItem("residentGroupId"));
                console.log("  - authenticatedResidentId:", localStorage.getItem("authenticatedResidentId"));
                console.log("  - authenticatedResidentUserName:", localStorage.getItem("authenticatedResidentUserName"));

                navigate("/resident-page")
            }

            if(response.role === COMPANY_ROLE){
                localStorage.setItem("companyGroupId",response.groupId);
                localStorage.setItem("authenticatedCompanyUserId",response.user.id);
                localStorage.setItem("authenticatedCompanyUserName",response.user.userName);

                console.log("📊 [LOGIN] Company login - stored data:");
                console.log("  - companyGroupId:", localStorage.getItem("companyGroupId"));
                console.log("  - authenticatedCompanyUserId:", localStorage.getItem("authenticatedCompanyUserId"));
                console.log("  - authenticatedCompanyUserName:", localStorage.getItem("authenticatedCompanyUserName"));
            }

            if (response.role === USER_ROLE) {
                console.log("📊 [LOGIN] USER role login - setting user data");
                console.log("📊 [LOGIN] User ID to set:", response.user.id);
                console.log("📊 [LOGIN] User name to set:", response.user.userName);

                localStorage.setItem("authenticatedUserId", response.user.id);
                localStorage.setItem("authenticatedUserName", response.user.userName);

                setAuthenticatedUserId(response.user.id);
                setAuthenticatedUserName(response.user.userName);

                console.log("📊 [LOGIN] After setting - localStorage check:");
                console.log("  - authenticatedUserId:", localStorage.getItem("authenticatedUserId"));
                console.log("  - authenticatedUserName:", localStorage.getItem("authenticatedUserName"));

                const hasActiveRequest =
                    response.activeApartmentRequest === "ACTIVE" ||
                    response.activeCompanyRequest === "ACTIVE";

                console.log("📊 [LOGIN] Active requests:", {
                    activeApartmentRequest: response.activeApartmentRequest,
                    activeCompanyRequest: response.activeCompanyRequest,
                    hasActiveRequest: hasActiveRequest
                });

                if (hasActiveRequest) {
                    console.log("🔄 [LOGIN] User has active request - navigating to pending-request");
                    setShowPendingView(true)
                    navigate("/resident-request", { state: { hasActiveRequest: true } });
                    return;
                }

                console.log("🔄 [LOGIN] No active request - navigating to choose-role");
                navigate("/choose-role");

                return;
            }


        }catch(error){

            setMessage(error.message);
            console.error('❌ [LOGIN] Log in has failed:', error.message);

            resetForm()

        }finally {
            setIsLoading(false)
        }

    }

    return(

        <div className='login-page'>

            <div className='login-container'>

                <div className='login-text-container'>
                    <h1>HomeLink</h1>
                    <h2>Welcome back!</h2>
                </div>

                <div className='login-form-container'>
                    <AuthForm
                        handleChange={handleInputChange}
                        formData={loginFormData}
                        handleSubmit={handleSubmit}
                        message={message}
                        isLoading={isLoading}
                        type={"login"}
                    />
                </div>

            </div>

            <div className='image-side'>
                <img
                    src={loginImage}
                    alt="Modern home interior"
                    className="login-image"
                />
            </div>

        </div>

    )

}

export default Login;