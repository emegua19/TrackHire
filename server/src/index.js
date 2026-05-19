import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`TrackHire Server is running on http://localhost:${PORT}`);
});