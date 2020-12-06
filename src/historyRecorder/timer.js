import historyRecorder from "./historyRecorder.js";

let msInHour = 1000 * 60 * 60;

export default (redisIp, redisPort) => {
  historyRecorder(redisIp, redisPort);
  startTimerAtNextFullHour();
}

function startTimerAtNextFullHour(){
  let lastFullHour = Date.now() - (new Date().getMinutes() * 1000 * 60) - (new Date().getSeconds() * 1000);
  let nextFullHour = lastFullHour + msInHour;
  let msTillFullHour = nextFullHour - Date.now();
  
  setTimeout(() => {
    tick();
    startTimer();
  }, msTillFullHour);
}

function startTimer(){
  setInterval(() => {
    tick();
  }, msInHour);
}

async function tick(){
  console.log(new Date())
}