import dotenv from "dotenv";
import app from "./app.js";
import {connectDB} from "./db/index.js";

dotenv.config({
  path: ".env",
});

console.log(process.env.MONGO_URI)
app.on("error", (err) => {
  console.error("Error from app.on", err);
});

connectDB()
  .then(() => {
    app.on("error from app.on", (err) => {
      console.error(err + "im from index.js");
      throw err;
    });
    app.listen(process.env.PORT || 3003, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("MONGODB CONNECTION FAILED: " + err));
