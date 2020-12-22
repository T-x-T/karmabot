export default {
  components: true,
  srcDir: "./web",
  css: ["assets/colors", "assets/general"],
  modules: [
    "@nuxtjs/axios",
    "cookie-universal-nuxt"
  ],
  axios: {
    proxy: true,
  },
  proxy: {
    "/api/v1/": process.env.NODE_ENV === "prod" ? "https://thetxt.io" : "http://localhost:4005"
  }
}