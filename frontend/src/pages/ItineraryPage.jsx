import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from 'react';

const ItineraryPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);

  useEffect(() => {
    if (!itinerary) {
      // If no state is passed, fetch from backend using ID
      const fetchItinerary = async () => {
        try {
          const res = await axiosInstance.get(`/itinerary/getItinerary/${id}`);
          setItinerary(res.data);
        } catch (err) {
          console.error("Failed to fetch itinerary:", err);
        }
      };
      fetchItinerary();
    }
  }, [id, itinerary]);

  const handleDownload = () => {
    if (!itinerary) return;

    const itineraryText = `
      Trip Itinerary

      From: ${itinerary.source}
      To: ${itinerary.destination}
      Duration: ${itinerary.numDays} days
      Budget: ₹${itinerary.budget}
      Interests: ${itinerary.interests.join(", ")}

      Itinerary:
      ${itinerary.content}
    `;

    const blob = new Blob([itineraryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `itinerary-${itinerary.destination}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!itinerary) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-base-100">
      <div className="max-w-3xl rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Your Trip Itinerary</h1>
        <p><strong>From:</strong> {itinerary.source}</p>
        <p><strong>To:</strong> {itinerary.destination}</p>
        <p><strong>Duration:</strong> {itinerary.numDays} days</p>
        <p><strong>Budget:</strong> ₹{itinerary.budget}</p>
        <p><strong>Interests:</strong> {itinerary.interests.join(", ")}</p>
        <hr className="my-4"/>
        <p className="whitespace-pre-line">{itinerary.content}</p>
        <button
          onClick={handleDownload}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Download Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryPage;
