import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        numDays: {
            type: Number,
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        interests: {
            type: [String],
        },
        content: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

const Itinerary = mongoose.model("Itinerary",itinerarySchema);

export default Itinerary;