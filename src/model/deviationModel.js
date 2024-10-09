import mongoose from "mongoose";

const deviationSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ["bitcoin", "matic-network", "ethereum"],
  },
  deviation: {
    type: Number,
    required: true,
  },
  calculated_at: {
    type: Date,
    default: Date.now,
  },
});

const Deviation = mongoose.model("Deviation", deviationSchema);
export default Deviation
