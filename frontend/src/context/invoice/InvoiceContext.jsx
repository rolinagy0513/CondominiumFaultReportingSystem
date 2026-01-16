import {useState, createContext} from "react";

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {

    const[reportId, setReportId] = useState(0);

    const[invoiceNumber, setInvoiceNumber] = useState("");
    const[customerName, setCustomerName] = useState("");
    const[buildingNumber, setBuildingNumber] = useState(0);
    const[roomNumber, setRoomNumber] = useState(0);

    const[companyName, setCompanyName] = useState("");

    const[reportName, setReportName] = useState("");

    const[cost, setCost] = useState(0.0);

    return (
        <InvoiceContext.Provider value={{
            reportId, setReportId,
            invoiceNumber, setInvoiceNumber,
            customerName, setCustomerName,
            buildingNumber, setBuildingNumber,
            roomNumber, setRoomNumber,
            companyName, setCompanyName,
            reportName, setReportName,
            cost, setCost
        }}>
            {children}
        </InvoiceContext.Provider>
    );
};