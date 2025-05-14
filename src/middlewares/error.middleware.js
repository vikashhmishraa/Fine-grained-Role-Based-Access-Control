// middlewares/error.middleware.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {
  // If the error is an instance of your custom ApiError
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode || 500)
      .json(new ApiResponse(false, err.message || "Something went wrong", err.data || {}));
  }

  // For any other unknown error
  console.error("Unhandled Error ➡️", err);

  return res
    .status(500)
    .json(new ApiResponse(false, "Internal Server Error", {}));
};
