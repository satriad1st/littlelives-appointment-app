import axios from "@/modules/axios";

/**
 * ### Sets the authorization token in the headers of the Axios instance.
 * * If the token value is provided, the function sets the 'Authorization' header with the value 'Bearer {token}'.
 * * If the token value is not provided, the function deletes the 'Authorization' header.
 *
 * @param val - Optional. A string representing the token value. Remove token when empty
 * @param type - Optional. A string representing the bearer type. default value is 'Bearer'
 *
 * @example
 * axios.post('/login', body)
 *  .then(( response: { accessToken: string, refreshToken: string }) => {
 *    setRequestToken(response.accessToken);
 *   })
 */
export const setRequestToken = (val?: string, type: string = "Bearer") => {
  if (!val) {
    delete axios.defaults.headers.common.Authorization;
  } else {
    axios.defaults.headers.common.Authorization = `${type} ${val}`;
  }
};
