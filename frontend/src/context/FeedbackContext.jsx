/**
 * @file FeedbackContext.jsx
 * @description
 * React Context for managing UI feedback states throughout the application.
 *
 * This context provides a centralized way to manage feedback-related state,
 * allowing components to respond to various user interaction.
 *
 * ### Responsibilities:
 * - Controls the `isLoading` state to indicate ongoing operations and display loading indicators.
 * - Manages success and error messages via `message` and `error` states.
 *
 */


import {createContext, useState} from "react";

export const FeedbackContext = createContext()

export const  FeedBackProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    return (
        <FeedbackContext.Provider value={
            {
                isLoading,setIsLoading,
                message,setMessage,
                error,setError,
            }
        }>
            {children}
        </FeedbackContext.Provider>
    );

};