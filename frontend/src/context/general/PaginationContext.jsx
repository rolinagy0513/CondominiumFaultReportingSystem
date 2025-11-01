/**
 * @file PaginationContext.jsx
 * @description
 * React Context for managing pagination related states.
 *
 * This context provides states for the endpoints that are requiring pagination data
 *
 * ### Responsibilities:
 * - Manages currentPage which sets the actual page that the user wants to display.
 * - Manages totalPages which sums the number of pages.
 * - Manges totalElements which sums the number of elements in all the pages.
 * - Manages pageSize which is set to 10 to always display 10 elements in one page
 */


import {useState, createContext} from "react";

export const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    return (
        <PaginationContext.Provider value={{
            currentPage, setCurrentPage,
            totalPages, setTotalPages,
            totalElements, setTotalElements,
            pageSize
        }}>
            {children}
        </PaginationContext.Provider>
    );
};