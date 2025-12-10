import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

// Health Check
const checkHealth = asyncHandler(async (_req, res) => {
  // return response
  return res.status(200).json(new ApiResponse(200, {}, "Server Running !!!"));
});

export { checkHealth };
