import router from "../webApi/router.js";

import https from "https";
import qs from "qs";

let clientId, clientSecret, redirectUri, baseUrl;

export default (_clientId, _clientSecret, _redirectUri, _baseUrl) => {
  clientId = _clientId;
  clientSecret = _clientSecret;
  redirectUri = _redirectUri;
  baseUrl = _baseUrl;

  router.register(
    (req) => req.path.startsWith("login"),
    async (req) => {
      if(!req.query.hasOwnProperty("code")) throw new Error("No code provided");
      const userData = await getUserDataFromCode(req.query.code);
      return {
        statusCode: 307,
        payload: {
          Location: `${baseUrl}/stats`,
          "Set-Cookie": [
            `userId=${userData.id};path=/`,
            `userName=${userData.username}#${userData.discriminator};path=/`,
          ],
        },
        contentType: "text/plain"
      };
    }
  );
}

function getUserDataFromCode(code){
  return new Promise((resolve, reject) => {
    const payload = qs.stringify({
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      scope: "identify"
    });

    const options = {
      host: "discord.com",
      port: 443,
      path: "/api/oauth2/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };

    const req = https.request(options, (res) => {
      res.setEncoding("utf-8");
      let resData = "";
      res.on("data", (chunk) => resData += chunk);
      res.on("end", async () => {
        resData = JSON.parse(resData);
        const access_token = resData.access_token;
        if(!access_token) {
          reject("No access token found in response from Discords API")
        }else{
          resolve(await getUserDataFromAccessToken(access_token));
        }
      });
    });

    req.on("error", (e) => reject("Request to Discords oauth API failed: ", e));

    req.write(payload);
    req.end();
  });
}

function getUserDataFromAccessToken(access_token){
  return new Promise((resolve, reject) => {
    const options = {
      host: "discord.com",
      port: 443,
      path: "/api/users/@me",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer " + access_token
      }
    };

    https.get(options, (res) => {
      res.setEncoding("utf-8");
      let resData = "";
      res.on("data", (chunk) => resData += chunk);
      res.on("end", () => {
        resData = JSON.parse(resData);
        const userData = resData;
        if(!userData) {
          reject("No userId found in response from Discords API");
        } else {
          resolve(userData);
        }
      });
    });
  });
}