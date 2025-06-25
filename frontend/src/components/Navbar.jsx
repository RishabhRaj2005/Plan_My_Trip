import React, { useEffect, useState } from 'react';
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import { Trash2 } from "lucide-react";
import defaultAvatar from '/avatar.png';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await axiosInstance.get('/itinerary/getUserItinerary');
        setItineraries(res.data.itineraries);
      } catch (err) {
        console.error("Failed to load itinerary history", err);
      }
    };
    fetchItineraries();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/itinerary/delete/${id}`);
      setItineraries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Failed to delete itinerary", err);
    }
  };

  return (
    <div className="p-4 bg-base-100 shadow flex items-center justify-between">
      {/* Drawer Toggle */}
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn btn-primary">
            View History
          </label>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer" className="drawer-overlay" aria-label="close sidebar"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
            <h2 className="text-lg font-semibold mb-2">Your Past Trips</h2>
            {itineraries.length === 0 ? (
              <li className="text-sm">No itineraries found.</li>
            ) : (
              itineraries.map((itinerary) => (
                <li key={itinerary._id}>
                  <div className="flex items-center justify-between w-full">
                    <a
                      onClick={() => navigate(`/itinerary/${itinerary._id}`)}
                      className="cursor-pointer hover:underline text-sm"
                    >
                      {itinerary.source} ➝ {itinerary.destination} ({itinerary.numDays} days)
                    </a>
                    <button
                      className="btn btn-xs btn-error ml-2"
                      onClick={() => handleDelete(itinerary._id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-4 pr-4">
        <span className="text-lg font-medium whitespace-nowrap">Plan My Trip</span>
        <button className="btn" onClick={() => navigate('/')}>New Trip</button>
        <div
          className="w-20 h-20 rounded-full overflow-hidden border-4 border-base-content cursor-pointer"
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <img
            src={authUser?.profilePic || defaultAvatar}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="btn" onClick={() => navigate('/profile')}>Profile</button>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;