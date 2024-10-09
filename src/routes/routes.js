import { Router } from "express";
const router = new Router();
import Stats from "../controller/cryptoStats.js";
import CalDeviation from "../controller/cryptoDeviations.js";
router.route("/stats").get(Stats);
router.route("/deviation").get(CalDeviation);
export default router;
