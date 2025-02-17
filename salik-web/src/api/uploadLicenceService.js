import axios from "axios";

const API_URL = "http://localhost:5000/api"; //your actual API URL

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data; // Assuming API returns { url: "image_url" }
};

export default { uploadImage };
