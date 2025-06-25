import { useState } from "react"
import React from 'react'
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    duration: "",
    budget: "",
    interests: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const interestOptions = ["Adventure", "History", "Culture", "Nature", "Nightlife"];

  const handleInterestChange = (e) => {
    const value = e.target.value;
    setFormData((prevState) => {
      if (prevState.interests.includes(value)) {
        // remove if already selected
        return {
          ...prevState,
          interests: prevState.interests.filter((i) => i !== value),
        };
      } else {
        // add new interest
        return {
          ...prevState,
          interests: [...prevState.interests, value],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/itinerary/generate", {
        source: formData.source,
        destination: formData.destination,
        numDays: Number(formData.duration),
        budget: Number(formData.budget),
        interests: formData.interests,
      });
      const newItinerary = res.data.itinerary;
      navigate(`/itinerary/${newItinerary._id}`, { state: { itinerary: newItinerary } });
      console.log("Itinerary:", res.data.itinerary);
    } catch (err) {
      console.error("Error generating itinerary:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-10xl space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Let Me Plan Your Next Trip</h1>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Source</span>
              </label>
              <div className="relative">
                <input
                  name="source"
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.source}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Destination</span>
              </label>
              <div className="relative">
                <input
                  name="destination"
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Duration</span>
              </label>
              <div className="relative">
                <input
                  name="duration"
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{`Budget per Person (In INR)`}</span>
              </label>
              <div className="relative">
                <input
                  name="budget"
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Interests</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center gap-2">
                  <input
                  name="interests"
                  type="checkbox"
                  value={interest}
                  checked={formData.interests.includes(interest)}
                  onChange={handleInterestChange}
                  className="checkbox"
                  />
                  <span>{interest}</span>
                </label>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HomePage