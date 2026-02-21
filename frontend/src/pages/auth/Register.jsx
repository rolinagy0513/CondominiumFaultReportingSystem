import React, {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

import registerImage from "../../assets/building.png";

import {FeedbackContext} from "../../context/general/FeedbackContext.jsx";
import {AuthContext} from "../../context/auth/AuthContext.jsx";
import {UserContext} from "../../context/general/UserContext.jsx";

import apiServices from "../../services/ApiServices.js";

import AuthForm from "./components/AuthForm.jsx";

import "./styles/Register.css"

const Register = () =>{


    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const REGISTER_URL = `${AUTH_API_PATH}/register`;

    const navigate = useNavigate();

    const { message, setMessage, isLoading, setIsLoading } = useContext(FeedbackContext);
    const { registerFormData, setRegisterFormData} = useContext(AuthContext);
    const { setAuthenticatedUserId, setAuthenticatedUserName } = useContext(UserContext);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|biz|info|io|co|uk|de|fr|es|it|nl|ru|br|au|jp|cn|in|me|tv|us|ca|mx)$/i;
        return emailRegex.test(email);
    };

    const resetForm = () =>{
        setRegisterFormData({
            firstName:'',
            lastName:'',
            email: '',
            password: '',
            confirmPassword:'',
        })
    }

    useEffect(() => {
        resetForm();
    }, []);

    const handleInputChange = (e) => {
        setMessage("");
        const { name, value } = e.target;
        setRegisterFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setMessage('');
        setIsLoading(true)

        if (!validateEmail(registerFormData.email)) {
            setMessage("Please enter a valid email address (e.g., name@domain.com)");
            setIsLoading(false);
            return;
        }

        try{

            const response = await apiServices.post(REGISTER_URL,registerFormData);

            resetForm()

            localStorage.setItem("authenticatedUserId", response.user.id);
            localStorage.setItem("authenticatedUserName", response.user.userName);

            setAuthenticatedUserId(response.user.id);
            setAuthenticatedUserName(response.user.userName);

            navigate("/choose-role");

        }catch(error){

            setMessage(error.message);
            console.error('Registration failed:', error.message);

            resetForm()

        }finally {
            setIsLoading(false)
        }

    }

    return(

        <div className='register-page'>

            <div className='register-container'>

                <div className='register-text-container'>
                    <h1>HomeLink</h1>
                    <h2>Your best apartment reporting platform</h2>
                    <h3>Register to our system!</h3>
                </div>

                <div className='register-form-container'>
                    <AuthForm
                        handleChange={handleInputChange}
                        formData={registerFormData}
                        handleSubmit={handleSubmit}
                        message={message}
                        isLoading={isLoading}
                        type={"register"}
                    />
                </div>

            </div>

            <div className='image-side'>
                <img
                    src={registerImage}
                    alt="Modern home interior"
                    className="register-image"
                />
            </div>

        </div>

    )

}

export default Register;