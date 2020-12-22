<template>
  <div id="topListUsersDiv">
    <table class="topListTable">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Karma</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in topList" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item.karma}}</td>
          <td>{{item.userTag}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data (){
    return {
      topList: []
    }
  },

  async fetch(){
    this.topList = await this.$axios.$get("/api/v1/toplists/users");
  }
}
</script>

<style lang="sass" scoped>
#topListUsersDiv
  display: flex
  align-content: center
  justify-content: center
</style>