import express from "express";
import { generateItinerary, getUserItineraries, getItineraryById, deleteItinerary } from "../controllers/itinerary.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate", protectRoute, generateItinerary);
router.get("/getUserItinerary", protectRoute,getUserItineraries);
router.get("/getItinerary/:id", protectRoute,getItineraryById);
router.delete("/delete/:id", protectRoute, deleteItinerary);

export default router;