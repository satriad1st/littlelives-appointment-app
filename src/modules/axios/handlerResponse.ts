import { AxiosResponse } from "axios";
import chalk from "chalk";

/**
 * Logs the response data to the console using the `chalk` library for styling, and then returns the response.
 *
 * @param response - The response object received from an Axios request.
 * @returns The same response object that was passed as input.
 */
export const responseHandler = (response: AxiosResponse<any>) => {
  if (process.env.NODE_ENV === "development") {
    console.log(chalk.bgBlue("Response"), chalk.blue(JSON.stringify(response.data, null, 2)));
  }
  return response;
};
