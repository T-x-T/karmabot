export default {
  components: true,
  srcDir: "./web",
  css: ["assets/colors", "assets/general"],
  modules: [
    "@nuxt/http",
    "@nuxtjs/axios"
  ],
  axios: {
    baseURL: "https://thetxt.io/api/v1",
    proxy: true
  }
}