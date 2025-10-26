import {useNavigate} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import {FeedbackContext} from "../../context/FeedbackContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import apiServices from "../../services/ApiServices.js";
import AuthForm from "../../components/AuthForm.jsx";

import "./styles/Register.css"

const Register = () =>{


    const AUTH_API_PATH = import.meta.env.VITE_API_BASE_AUTH_URL;
    const REGISTER_URL = `${AUTH_API_PATH}/register`;

    const navigate = useNavigate();

    const { message, setMessage, isLoading, setIsLoading } = useContext(FeedbackContext);
    const { registerFormData, setRegisterFormData} = useContext(AuthContext);

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

        try{

            const response = await apiServices.post(REGISTER_URL,registerFormData);
            console.log("Successfully logged in")

            resetForm()

            // navigate("/main");

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
                    src="../../assets/building.png"
                    alt="Modern home interior"
                    className="register-image"
                />
            </div>

        </div>

    )

}

export default Register;