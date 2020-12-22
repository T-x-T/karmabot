export default {
  components: true,
  srcDir: "./web",
  css: ["assets/colors", "assets/general"],
  modules: [
    "@nuxt/http",
    "@nuxtjs/axios",
    "cookie-universal-nuxt"
  ],
  axios: {
    proxy: true,
  },
  proxy: {
    "/api/v1/": "http://localhost:4005"
  },
  env: {
    apiUrl: process.env.NODE_ENV === "prod" ? "https://thetxt.io" : "http://localhost:3000"
  }
}