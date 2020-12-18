import http from "http";
import url from "url";

import karmaRetriever from "../karmaRetriever/webApi.js";
import router from "./router.js";

export default function(port){
  let httpServer = http.createServer(listener);
  httpServer.listen(port, () => {
    console.log("API Webserver started");
  });
}

async function listener(req, res){
  let reqData = getRequestData(req);

  res.setHeader("Content-Type", "application/json");

  //Currently there is only the v1 API
  if(reqData.path.startsWith("/api/v1/")){
    reqData.path = reqData.path.replace("/api/v1/", "");
    try{
      const resData = await router.route(reqData);
      if(resData){
        res.writeHead(200);
        res.end(JSON.stringify(resData));
      }else{
        res.writeHead(404);
        res.end("{\"error\": \"API resource not found\"}");
      }
    }catch(e){
      res.writeHead(500);
      res.end(JSON.stringify({error: e.message}));
      console.log(e);
    }
  }else{
    res.writeHead(404);
    res.end("{\"error\": \"API resource not found\"}");
  }
}

function getRequestData(req){
  const parsedUrl = url.parse(req.url, true);

  return {
    path: parsedUrl.pathname,
    method: req.method,
    query: parsedUrl.query
  }
}