import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import config from "./config/config.js";

import userRoute from "./routes/userRoutes.js";
import itemRoute from "./routes/itemRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import orderRoute from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "🚀 POS + CRM Server Running"
    });
});

app.use("/api/users", userRoute);
app.use("/api/items", itemRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/orders", orderRoute);

// Connect DB
await connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;