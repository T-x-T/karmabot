<template>
  <div id="wrapper">
    <h1 class="accent">Your Karma:</h1>
    <table class="topListTable">
      <thead>
        <tr>
          <th>Server</th>
          <th>Karma</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Total</td>
          <td>{{totalkarma}}</td>
        </tr>
        <tr v-for="(item, index) in guildkarma" :key="index">
          <td>{{item.guildName}}</td>
          <td>{{item.guildkarma}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data: () => ({
    totalkarma: null,
    guildkarma: null
  }),
  props: {
    userId: String
  },
  mounted: async function() {
    this.totalkarma = (await this.$axios.$get(`/api/v1/users/${this.userId}/totalkarma`)).totalkarma;
    this.guildkarma = await this.$axios.$get(`/api/v1/users/${this.userId}/guildkarma`);
  }
}
</script>

<style lang="sass" scoped>
#wrapper
  display: flex
  align-content: center
  justify-content: center
  flex-direction: column
  text-align: center
</style>