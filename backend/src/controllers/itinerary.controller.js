import Itinerary from "../model/itinerary.model.js";
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

export const generateItinerary = async (req,res) => {
    try{
        const {source, destination, numDays, budget, interests} = req.body;

        if(!source||!destination||!numDays||!budget){
            return res.status(400).json({error: "Missing required fields"})
        }

        const prompt = `Create a ${numDays}-day travel itinerary from ${source} to ${destination} for a budget of ${budget} INR.` +
            (interests?.length ? ` Focus on these interests: ${interests.join(", ")}.` : "") + " Also provide hotel recommendations for each day. Answer in 200 words.";

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const generatedText=response.text
        const newItinerary = new Itinerary({
            userId: req.user.id,
            source: source,
            destination: destination,
            numDays: numDays,
            budget: budget,
            interests: interests,
            content: generatedText
        })

        await newItinerary.save();

        res.status(201).json({
            message: "Itinerary generated successfully",
            itinerary: newItinerary,
        });

    } catch(err){
        console.log("Error in generating itinerary: ",err);
        res.status(500).json({error: "Something went wrong"});
    }
}

export const getUserItineraries = async (req, res) => {
    try {
        const userId = req.user.id;

        const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "User itineraries fetched successfully",
            itineraries,
        });
    } catch (error) {
        console.error("Error fetching user itineraries:", error);
        res.status(500).json({ error: "Failed to fetch itineraries." });
    }
};

export const getItineraryById = async (request, response) => {
    try {
        const itinerary = await Itinerary.findById(request.params.id);

        response.status(200).json(itinerary);
    } catch (error) {
        response.status(500).json(error)
    }
}

export const deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found" });
    }
    
    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Itinerary.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};