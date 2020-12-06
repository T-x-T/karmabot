import karmaReaderWriter from "./karmaReaderWriter.js";

export default (redisIp, redisPort) => {
  karmaReaderWriter.connect(redisIp, redisPort);
}