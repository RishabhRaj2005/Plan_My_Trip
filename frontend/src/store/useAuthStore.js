import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLogingIn: false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data});
        } catch (error) {
            console.log("Error in checkAuth: ",error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            toast.success("Account created successfully");
            set({authUser: res.data});
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);
        } finally {
            set({ isSigningUp: false});
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data});
            toast.success("Logged in successfully");
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);
        } finally {
            set({ isSigningUp: false});
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Something went wrong";
            toast.error(message);
        }
    },

    updateProfile: async(data) => {
        set({isUpdatingProfile: true});
        try {
            const res= await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile: ",error);
            toast.error(error.response.data.message)
        } finally{
            set({ isUpdatingProfile: false })
        }
    },
}))