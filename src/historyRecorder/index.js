import timer from "./timer.js";
import historyRecorder from "./historyRecorder.js";
import karmaReaderWriter from "./karmaReaderWriter.js";

export default async (redisIp, redisPort) => {
  historyRecorder.connect(redisIp, redisPort);
  await karmaReaderWriter.connect(redisIp, redisPort);

  historyRecorder.connect(karmaReaderWriter);
  timer(historyRecorder);
}