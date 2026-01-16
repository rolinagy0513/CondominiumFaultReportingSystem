import apiServices from "../services/ApiServices.js";

export const usePDF = () => {
    const generateInvoicePdf = async (invoiceData) => {
        try {
            // Make POST request to generate PDF
            const response = await apiServices.post('/api/resident/pdf/download', invoiceData);

            // The response should be a blob for the PDF
            // Note: You might need to adjust this based on your actual API response
            return response;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    };

    const downloadPDF = async (invoiceData) => {
        try {

            const response = await fetch('/api/resident/pdf/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(invoiceData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Get the blob from response
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${invoiceData.invoiceNumber}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return true;
        } catch (error) {
            console.error('Error downloading PDF:', error);
            throw error;
        }
    };

    return {
        generateInvoicePdf,
        downloadPDF
    };
};