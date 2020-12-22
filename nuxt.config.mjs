export default {
  components: true,
  srcDir: "./web",
  css: ["assets/colors", "assets/general"],
  modules: [
    "@nuxt/http",
    "@nuxtjs/axios",
    "cookie-universal-nuxt"
  ],
/*   axios: {
    proxy: true,
    prefix: "/api/v1/",
    baseURL: "http://localhost:4005",
    browserBaseURL: "http://localhost:4005"
  },
  publicRuntimeConfig: {
    axios: {
      baseURL: 'http://localhost:4005'
    }
  },
  proxy: {
    "/": "http://localhost:4005"
  } */
}