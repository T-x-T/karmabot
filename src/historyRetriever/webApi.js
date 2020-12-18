import router from "../webApi/router.js";

let historyRetriever;

export default (_historyRetriever) => {
  historyRetriever = _historyRetriever;
  handlers.forEach(x => x());
}

const handlers = [
  () => {
    router.register(
      (req) => req.path.startsWith("history/totalkarma"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        return await historyRetriever.getTotalKarmaHistory(hoursInPast);
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("history/userkarma/"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        const userId = req.path.split("/")[2];
        return await historyRetriever.getUserKarmaHistory(hoursInPast, userId);
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("history/guild/") && req.path.includes("/totalkarma"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        const guildId = req.path.split("/")[2];
        return await historyRetriever.getGuildKarmaHistory(hoursInPast, guildId);
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("history/guild/") && req.path.includes("/userkarma/"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        const userId = req.path.split("/")[4];
        const guildId = req.path.split("/")[2];
        return await historyRetriever.getUserInGuildKarmaHistory(hoursInPast, userId, guildId);
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("history/usercount"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        return await historyRetriever.getUserCountHistory(hoursInPast);
      }
    )
  },

  () => {
    router.register(
      (req) => req.path.startsWith("history/guildcount"),
      async (req) => {
        const hoursInPast = req.query.hoursInPast ? req.query.hoursInPast : 24 * 7;
        return await historyRetriever.getGuildCountHistory(hoursInPast);
      }
    )
  }
];