import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import { FaCreditCard, FaUser, FaCalendarAlt, FaLock, FaMapMarkerAlt, FaFileInvoiceDollar } from "react-icons/fa"
import { BsFillCreditCard2FrontFill } from "react-icons/bs"

import {InvoiceContext} from "../../context/invoice/InvoiceContext.jsx";

import {usePDF} from "../../hooks/usePDF.js";
import {useReports} from "../../hooks/useReports.js";

import "./styles/Payment.css"

const Payment = () => {

    const {
        invoiceNumber, customerName,
        buildingNumber, roomNumber,
        companyName, reportName,
        cost, setInvoiceNumber,
        setCustomerName, setBuildingNumber,
        setRoomNumber, setCompanyName,
        setReportName, setCost,
        reportId,
    } = useContext(InvoiceContext);

    const navigate = useNavigate();

    const{
        downloadPDF,
    } = usePDF()

    const {
        getCompletedReportsForUser
    } = useReports()

    const [isProcessing, setIsProcessing] = useState(false);

    console.log("reportId:", reportId);
    console.log("invoiceNumber:", invoiceNumber);
    console.log("customerName:", customerName);
    console.log("buildingNumber:", buildingNumber);
    console.log("roomNumber:", roomNumber);
    console.log("companyName:", companyName);
    console.log("reportName:", reportName);
    console.log("cost:", cost);

    const handlePayment = async () => {
        if (!invoiceNumber || !customerName || !reportName) {
            alert("Invoice data is incomplete. Please go back and try again.");
            return;
        }

        setIsProcessing(true);
        try {

            const invoiceData = {
                reportId: reportId,
                invoiceNumber: invoiceNumber,
                customerName: customerName,
                buildingNumber: buildingNumber || 0,
                roomNumber: roomNumber || 0,
                companyName: companyName || "Condominium Management",
                reportName: reportName,
                cost: cost || 0,
                payedAt: new Date().toISOString()
            };

            console.log("Sending invoice data:", invoiceData);

            await downloadPDF(invoiceData);

            setInvoiceNumber("")
            setCustomerName("")
            setBuildingNumber(0)
            setRoomNumber(0)
            setCompanyName("")
            setReportName("")
            setCost(0.0)

            getCompletedReportsForUser();

        } catch (error) {
            console.error("Failed to generate invoice:", error);
            alert("Failed to generate invoice. Please try again.");
        } finally {
            setIsProcessing(false);
            navigate("/resident-page")
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-wrapper">
                <div className="summary-panel">
                    <div className="summary-header">
                        <BsFillCreditCard2FrontFill className="summary-icon" />
                        <h2>Payment Summary</h2>
                    </div>

                    <div className="summary-details">
                        <div className="summary-item">
                            <span>Subtotal</span>
                            <span>€{cost}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span className="total-amount">€{cost}</span>
                        </div>
                    </div>

                    <div className="security-badge">
                        <FaLock className="lock-icon" />
                        <div>
                            <h4>Secure Payment</h4>
                            <p>Your information is protected with 256-bit encryption</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Payment Form */}
                <div className="form-panel">
                    <div className="form-header">
                        <FaFileInvoiceDollar className="form-icon" />
                        <h1>Complete Your Payment</h1>
                        <p className="form-subtitle">Enter your payment details below</p>
                    </div>

                    <form className="payment-form">
                        {/* Card Number */}
                        <div className="input-group">
                            <div className="input-label">
                                <FaCreditCard className="input-icon" />
                                <label htmlFor="cardNumber">Card Number</label>
                            </div>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="cardNumber"
                                    placeholder="4242 4242 4242 4242"
                                    className="payment-input"
                                    maxLength="19"
                                />
                                <div className="card-logos">
                                    <div className="card-logo visa">VISA</div>
                                    <div className="card-logo mastercard">MC</div>
                                    <div className="card-logo amex">AMEX</div>
                                </div>
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div className="input-group">
                            <div className="input-label">
                                <FaUser className="input-icon" />
                                <label htmlFor="cardName">Cardholder Name</label>
                            </div>
                            <input
                                type="text"
                                id="cardName"
                                placeholder="John Michael Doe"
                                className="payment-input"
                            />
                        </div>

                        {/* Expiry & CVV */}
                        <div className="form-row">
                            <div className="input-group">
                                <div className="input-label">
                                    <FaCalendarAlt className="input-icon" />
                                    <label htmlFor="expiry">Expiry Date</label>
                                </div>
                                <input
                                    type="text"
                                    id="expiry"
                                    placeholder="MM/YY"
                                    className="payment-input"
                                    maxLength="5"
                                />
                            </div>

                            <div className="input-group">
                                <div className="input-label">
                                    <FaLock className="input-icon" />
                                    <label htmlFor="cvv">Security Code</label>
                                </div>
                                <div className="cvv-wrapper">
                                    <input
                                        type="text"
                                        id="cvv"
                                        placeholder="123"
                                        className="payment-input"
                                        maxLength="4"
                                    />
                                    <span className="cvv-hint">3-4 digits</span>
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="input-group">
                            <div className="input-label">
                                <FaMapMarkerAlt className="input-icon" />
                                <label htmlFor="address">Billing Address</label>
                            </div>
                            <input
                                type="text"
                                id="address"
                                placeholder="123 Main Street, Apt 4B"
                                className="payment-input"
                            />
                        </div>

                        {/* ZIP Code */}
                        <div className="input-group">
                            <div className="input-label">
                                <FaMapMarkerAlt className="input-icon" />
                                <label htmlFor="zip">ZIP / Postal Code</label>
                            </div>
                            <input
                                type="text"
                                id="zip"
                                placeholder="10001"
                                className="payment-input"
                            />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="terms-group">
                            <input type="checkbox" id="terms" className="terms-checkbox" />
                            <label htmlFor="terms">
                                I agree to the <a href="#terms" className="terms-link">Terms of Service</a> and
                                <a href="#privacy" className="terms-link"> Privacy Policy</a>
                            </label>
                        </div>

                        {/* Important Warning Message */}
                        <div className="info-alert">
                            <div className="alert-header">
                                <svg className="alert-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                </svg>
                                <h3>Payment System Notice</h3>
                            </div>
                            <div className="alert-content">
                                <p>
                                    <strong>Important:</strong> This is a demo payment interface. Actual payment processing is currently unavailable for financial compliance purposes.
                                    All data entered here is for demonstration only and will not be charged to your card.
                                </p>
                                <p>
                                    <strong>Next Step:</strong> Click "Pay and Download Invoice" to generate a PDF invoice with your details. No actual payment will be processed.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="payment-button"
                            onClick={handlePayment}
                        >
                            <span>{isProcessing ? "Downloading" : "Pay and Download Invoice"}</span>
                            <span className="button-amount">€{cost}</span>
                            <div className="button-arrow">→</div>
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Payment