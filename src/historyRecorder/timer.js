let historyRecorder;

const msInHour = 1000 * 60 * 60;

export default _historyRecorder => {
  historyRecorder = _historyRecorder;
  startTimerAtNextFullHour();
}

function startTimerAtNextFullHour(){
  const lastFullHour = Date.now() - (new Date().getMinutes() * 1000 * 60) - (new Date().getSeconds() * 1000);
  const nextFullHour = lastFullHour + msInHour;
  const msTillFullHour = nextFullHour - Date.now();
  
  //Start timer on next full hour
  setTimeout(() => {
    startTimer();
  }, msTillFullHour);
}

function startTimer(){
  tick(); //Tick once here because setInterval first executes after delay is up
  setInterval(() => {
    tick();
  }, msInHour);
}

async function tick(){
  historyRecorder.executeTick();
}