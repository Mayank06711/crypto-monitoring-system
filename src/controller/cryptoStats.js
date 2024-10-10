import Joi from "joi";
import Crypto from "../model/cryptoModel.js";
import { ApiError } from "../utils/ApiError.js"
const schema = Joi.object({
  coin: Joi.string().valid("bitcoin", "matic-network", "ethereum").required(),
});
const Stats = async (req, res) => {
  const { error, value } = schema.validate(req.query);
  if (error)
    return res.status(400).json(new ApiError(400, error.details[0].message));
  try {
    const latestData = await Crypto.findOne({ coin: value.coin })
      .sort({ timestamp: -1 })
      .exec();

    if (!latestData) {
      return res
        .status(404)
        .json(new ApiError(500, `No data found for ${value.coin}`));
    }

    const { price, marketCap, change24h } = latestData;
    res.json({ price, marketCap, "24hChange": change24h });
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export default Stats;
