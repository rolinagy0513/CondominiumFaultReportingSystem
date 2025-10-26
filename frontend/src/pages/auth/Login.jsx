import React, {useContext, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';

import apiServices from "../../services/ApiServices.js";

import {FeedbackContext} from "../../context/FeedbackContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";

import AuthForm from "../../components/AuthForm.jsx";

import "./styles/Login.css"

const Login = () =>{

    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const LOGIN_URL = `${AUTH_API_PATH}/authenticate`;

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

            if (response.permission){
                navigate("/admin-panel")
            }else{
                navigate("/welcome-page")
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
                    src="../../assets/building.png"
                    alt="Modern home interior"
                    className="login-image"
                />
            </div>

        </div>

    )

}

export default Login;