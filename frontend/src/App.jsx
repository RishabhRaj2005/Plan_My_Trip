import Navbar from "./components/Navbar";

import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ItineraryPage from "./pages/ItineraryPage";
import SettingsPage from "./pages/SettingsPage";

import { axiosInstance } from "./lib/axios";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import {Loader} from "lucide-react";
import {Toaster} from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage";

function App() {

  const { theme } = useThemeStore();

  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();

  console.log({onlineUsers});

  useEffect(()=>{
    checkAuth()
  }, [checkAuth]);

  console.log({authUser});

  if(isCheckingAuth && !authUser) return (

    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )

  return (
    <div data-theme={theme}>
      {authUser && <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/itinerary/:id" element={<ItineraryPage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;