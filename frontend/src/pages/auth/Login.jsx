import React, {useContext, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import apiServices from "../../services/ApiServices.js";

import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AuthContext} from "../../context/auth/AuthContext.jsx";

import AuthForm from "./components/AuthForm.jsx";
import loginImage from "../../assets/building.png";

import "./styles/Login.css"

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

    const resetForm = () =>{
        setLoginFormData({
            email: '',
            password: ''
        })
    }

    useEffect(() => {
        resetForm();
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

            const response = await apiServices.post(LOGIN_URL,loginFormData);

            resetForm()

            console.log(response.role)
            console.log(response.groupId)

            if (  response.role === ADMIN_ROLE && response.groupId){
                localStorage.setItem("adminGroupId",response.groupId);
                localStorage.setItem("authenticatedAdminId",response.user.id);
                localStorage.setItem("authenticatedAdminUserName",response.user.userName);

                console.log("In the Login")
                console.log(localStorage.getItem("adminGroupId"))
                console.log(localStorage.getItem("authenticatedAdminId"))
                console.log(localStorage.getItem("authenticatedAdminUserName"))

                navigate("/admin-panel")
            }

            if (response.role === RESIDENT_ROLE){
                localStorage.setItem("residentGroupId",response.groupId);
                localStorage.setItem("authenticatedResidentId",response.user.id);
                localStorage.setItem("authenticatedResidentUserName",response.user.userName);
            }

            if(response.role === COMPANY_ROLE){
                localStorage.setItem("companyGroupId",response.groupId);
                localStorage.setItem("authenticatedCompanyUserId",response.user.id);
                localStorage.setItem("authenticatedCompanyUserName",response.user.userName);
            }

            if (response.role === USER_ROLE){

                localStorage.setItem("authenticatedUserId", response.user.id);
                localStorage.setItem("authenticatedUserName", response.user.userName);

                navigate("/choose-role")
            }

        }catch(error){

            setMessage(error.message);
            console.error('Log in has failed:', error.message);

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