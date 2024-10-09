import express from "express";
import statsRoute from "./routes/routes.js";
import dotenv from "dotenv";
import "./utils/crons.js"; // to execute this file code when I start the server
const app = express();
console.log(process.env.MONGODB_URI);

import router from "./routes/routes.js";
// Routes
app.use("/api/v1/coins", router);

export default app;
