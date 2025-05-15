import express from "express"; 
import cors from "cors";
import cookieParser from "cookie-parser";

import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes

// import adminRoutes from "./routes/admin.routes.js";
// import authRoutes from "./routes/auth.routes.js";



app.use("/api/v1/admin", adminRoutes);

// Health Check
app.get("/", (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "Server working successfully"));
  } catch (error) {
    throw new ApiError(400, error, "Server Error");
  }
});

// ✨ Error Handler (at the END)
app.use(errorHandler);

export { app };
