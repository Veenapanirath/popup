
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createTables } from "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
const PORT = 5000;

const startServer = async () => {
  try {
    await createTables();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
};

startServer();
