import axios from "axios";
import Crypto from "../model/cryptoModel.js";
import Deviation from "../model/deviationModel.js";
const fetchCryptoData = async () => {
  const coins = ["bitcoin", "matic-network", "ethereum"];
  const promises = [];

  // Fetching data for all coins and storing in promises array
  for (const coin of coins) {
    const promise = axios
      .get(`${process.env.COINGECKO_API_URL}/coins/markets`, {
        params: {
          vs_currency: "usd",
          ids: coin,
        },
        headers: {
          "x-cg-demo-api-key": process.env.COINGECKO_API_KEY, // Fix: Use COINGECKO_API_KEY instead of COINGECKO_API_URL
        },
      })
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          console.log(`No data received for ${coin}`);
        }
        return {
          coin,
          data: response.data[0], // Assuming response.data[0] contains the data for the coin
        };
      })
      .catch((error) => {
        console.error(`Error fetching data for ${coin}:`, error.message);
        return null; // Return null in case of error to filter later
      });

    promises.push(promise);
  }
  try {
    // Resolving all promises
    const results = await Promise.all(promises);

    // Filtering out null results where data is not being fetched by axios
    const validResults = results.filter((result) => result !== null);

    // data to be stored in my database
    const cryptoData = validResults.map(({ coin, data }) => ({
      coin,
      price: data.current_price,
      marketCap: data.market_cap,
      market_cap_rank: data.market_cap_rank,
      change24h: data.price_change_percentage_24h,
      total_supply: data.total_supply,
      max_supply: data.max_supply,
      circulating_supply: data.circulating_supply,
    }));

    // Create documents in bulk
    if (cryptoData.length > 0) {
      // console.log("Creating documents in bulk...", cryptoData);
      await Crypto.insertMany(cryptoData);
      console.log("Data stored for:", cryptoData.map((c) => c.coin).join(", "));
    } else {
      console.log("No valid data to store.");
    }
  } catch (error) {
    console.error("Error storing data:", error.message);
    // Handle error here if needed
  }
};

const updatedDeviationDataTime = async () => {
  const coins = ["bitcoin", "matic-network", "ethereum"]; // Define the coins to update
  const currentTime = new Date(); // Get the current time

  try {
    // Update the calculated_at time for each coin
    await Promise.all(
      coins.map(async (coin) => {
        await Deviation.findOneAndUpdate(
          { coin }, // Match the coin
          { calculated_at: currentTime }, // Update the calculated_at time
          { new: true } // Return the updated document
        );
        console.log(`Updated calculated_at for ${coin} to ${currentTime}`);
      })
    );
  } catch (error) {
    console.error("Error while updating cronTime Data at DB:", error.message);
  }
};



export { fetchCryptoData, updatedDeviationDataTime};
