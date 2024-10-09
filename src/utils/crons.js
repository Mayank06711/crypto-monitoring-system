import cron from "node-cron";
import fetchCryptoData from "../controller/fetchDetails.js";
import { checkHealth } from "../db/index.js";
// cron.schedule("* * * * *", () => {
//   console.log("Fetching cryptocurrency data...");
//   fetchCryptoData();
// });
cron.schedule("0 */2 * * *", () => {
  console.log("Fetching cryptocurrency data...");
  if(checkHealth()){
  fetchCryptoData();
  }
  else {
    console.log("Database is not working. Skipping data fetching...");
    //process.exit(1); or can shutdown the server
    return;
  }
});


