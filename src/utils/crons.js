import cron from "node-cron";
import {
  fetchCryptoData,
  updatedDeviationDataTime,
} from "../controller/fetchDetails.js";
import { checkHealth } from "../db/index.js";

cron.schedule("0 */2 * * *", () => {
  console.log("Fetching cryptocurrency data...");
  if (checkHealth()) {
    fetchCryptoData(); // fetch data
    updatedDeviationDataTime(); // update the data time
  } else {
    console.log("Database is not working. Skipping data fetching...");
    //process.exit(1); or can shutdown the server
    return;
  }
});
