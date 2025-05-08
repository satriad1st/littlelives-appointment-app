import { InternalAxiosRequestConfig } from "axios";
import chalk from "chalk";

/**
 * ### Logs information about the request if the environment is not set to "production".
 * Returns the request object.
 *
 * @param request - The request object that contains information about the request.
 * @returns The same request object that was passed as input.
 */
export const requestHandler = (request: InternalAxiosRequestConfig<any>) => {
  if (process.env.NODE_ENV === "development") {
    // NGROK server skip warning on API Request
    request.headers.set("ngrok-skip-browser-warning", "any");

    // Debig  the url request
    console.log(
      chalk.bgGreen("Making request to") +
        ` ${chalk.bgGreenBright(` ${request.method} `)} ` +
        (request.url?.includes("http") ? "" : request.baseURL) +
        request.url,
      `\n${request.method !== "get" ? chalk.green(`Req ${JSON.stringify(request.data, null, 2)}`) : ""}\n`
    );
  }
  return request;
};
