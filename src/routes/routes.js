import { Router } from "express";
const router = new Router();
import Stats from "../controller/cryptoStats.js";
import Deviation from "../controller/cryptoDeviations.js";
router.route("/stats").get(Stats);
router.route("/deviation").get(Deviation);
export default router;
