import Joi from "joi";
import _ from "lodash";
import Crypto from "../model/cryptoModel.js";
import Deviation from "../model/deviationModel.js";
import { ApiError } from "../utils/apiError.js";
// Validation schema
const schema = Joi.object({
  coin: Joi.string().valid("bitcoin", "matic-network", "ethereum").required(),
});

// Standard Deviation Calculation
const standardDeviation = (values) => {
  const mean = _.mean(values);
  const squaredDiffs = values.map((value) => {
    const diff = value - mean;
    return diff * diff;
  });
  return Math.sqrt(_.mean(squaredDiffs));
};

const CalDeviation = async (req, res) => {
  const { error, value } = schema.validate(req.query);
  if (error)
    return res.status(400).json(new ApiError(400, error.details[0].message));

  try {
    //  pre-calculated deviation
    const preCalDev = await Deviation.findOne({ coin: value.coin });

    //  current time
    const currentTime = new Date();

    // If pre-calculated deviation exists, check the timestamp
    if (preCalDev) {
      const calculatedAt = new Date(preCalDev.calculated_at);
      const twoHoursInMillis = 2 * 60 * 60 * 1000; // 2 hours in milliseconds since cronJob runs at each 2 hours

      // Check if the pre-calculated deviation is less than 2 hours old
      if (currentTime - calculatedAt < twoHoursInMillis) {
        return res.json({ deviation: preCalDev.deviation }); // Return the pre-calculated deviation
      }
    }

    const prices = await Crypto.find({ coin: value.coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("price")
      .exec();
    if (prices.length < 2) {
      return res
        .status(400)
        .json(new ApiError(400, "Not enough data for calculation"));
    }
    const priceValues = prices.map((p) => p.price);
    const deviation = standardDeviation(priceValues); // calculating of the  standard deviation of the price
    // Save the new deviation in the database
    await Deviation.findOneAndUpdate(
      { coin: value.coin },
      { deviation, calculated_at: currentTime }, // Update with new deviation and current time
      { upsert: true } // Create a new document if it doesn't exist
    );
    res.json({ deviation: deviation.toFixed(2) });
  } catch (err) {
    res.status(500).json(new ApiError(500, "Server Error" || err?.message));
  }
};

export default CalDeviation;
