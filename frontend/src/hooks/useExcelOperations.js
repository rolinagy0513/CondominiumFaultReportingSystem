import apiServices from "../services/ApiServices.js";

export const useExcelOperations = () =>{

    const getExcelTemplate = async () => {
        try {
            const blob = await apiServices.download("/api/admin/bulk-upload/templateDownload");

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;

            let fileName = 'user_upload_template.xlsx';

            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            return { success: true, fileName };

        } catch (error) {
            console.error('Error downloading Excel template:', error);
            return {
                success: false,
                error: error.message || 'Failed to download template'
            };
        }
    };

    const uploadExcelFile = async (file) =>{

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/admin/bulk-upload/users', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.errors?.[0]?.errorMessage || 'Upload failed');
            }

            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('Error uploading Excel file:', error);
            return {
                success: false,
                error: { errors: [{ errorMessage: error.message || 'Upload failed' }] }
            };
        }
    }

    return({getExcelTemplate,uploadExcelFile})
}