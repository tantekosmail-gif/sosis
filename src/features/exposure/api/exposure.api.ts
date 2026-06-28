import axios from "axios";

export const exposureApi = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_URL,

    timeout:30000,

});