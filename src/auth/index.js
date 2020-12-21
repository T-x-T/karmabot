import webApi from "./webApi.js";

export default (clientId, clientSecret, redirectUri, baseUrl) => {
  webApi(clientId, clientSecret, redirectUri, baseUrl);
}