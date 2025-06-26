import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://plan-my-trip-hd4g.onrender.com/",
    withCredentials:true,
})