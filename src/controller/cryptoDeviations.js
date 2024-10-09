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

const Deviation = async (req, res) => {
  const { error, value } = schema.validate(req.query);
  console.log("hi", error, value);
  if (error)
    return res.status(400).json(new ApiError(400, error.details[0].message));

  try {
    const prices = await Crypto.find({ coin: value.coin })
      .sort({ timestamp: -1 })
      .limit(100)
      .select("price")
      .exec();
    console.log("hi", prices);
    if (prices.length < 2) {
      return res
        .status(400)
        .json(new ApiError(400, "Not enough data for calculation"));
    }
    const priceValues = prices.map((p) => p.price);
    const deviation = standardDeviation(priceValues); // calculating of the  standard deviation of the price
    res.json({ deviation: deviation.toFixed(2) });
  } catch (err) {
    res.status(500).json(new ApiError(500, "Server Error" || err?.message));
  }
};

export default Deviation;
