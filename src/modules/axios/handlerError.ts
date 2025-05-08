import { AxiosError, isAxiosError } from "axios";
import chalk from "chalk";
import { toast } from "sonner";

import { codeMessage } from "./enum";

/**
 * ### Handles errors returned by Axios requests.
 * It logs the error details and throws the error again.
 *
 * @param error - The error object returned by Axios.
 * @throws The error object to propagate it to the caller.
 *
 */
export const errorHandler = (error: AxiosError<any, any>) => {
  const code = error.response?.status as codeMessage;
  const errMsg = isAxiosError(error) ? (error.response?.data.message ?? "Something went wrong!") : error;

  if (code && code > 399) {
    console.error(chalk.bgRed(" AXIOS ERROR "), chalk.red(`${code}`), error, chalk.magenta(codeMessage[code]));
  }

  toast.error(errMsg, { icon: false });

  throw error;
};
