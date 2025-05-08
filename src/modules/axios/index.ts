import base from "axios";

import { errorHandler } from "./handlerError";
import { requestHandler } from "./handlerRequest";
import { responseHandler } from "./handlerResponse";

const axios = base.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});


// Create log for request
axios.interceptors.request.use(requestHandler);

// Create log for response
axios.interceptors.response.use(responseHandler, errorHandler);

export * from "./methods";
export default axios;
