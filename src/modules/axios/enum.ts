/**
 * Enum that maps HTTP status codes to corresponding messages.
 *
 * @enum {number}
 */
export enum codeMessage {
  "Sucess" = 200,
  "Successfuly add or modified data" = 201,
  "A request has been sent" = 202,
  "Successfully deleted " = 204,
  "Bad request" = 400,
  "Unauthenticated (incorrect username or password)" = 401,
  "Forbidden access" = 403,
  "Not exist" = 404,
  "The format of the request is not available" = 406,
  "The requested resource is permanently deleted and will not be retrieved" = 410,
  "A validation error occurred when creating an object" = 422,
  "An error occurred on the server" = 500,
  "Gateway error" = 502,
  "The service is unavailable, server is temporarily overloaded or maintained" = 503,
  "The gateway timed out" = 504,
}
