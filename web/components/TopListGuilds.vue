<template>
  <div id="topListGuildsDiv">
    <h1 class="accent">Top Servers:</h1>
    <table class="topListTable">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Karma</th>
          <th>Server</th>
          <th>Members</th>
          <th class="hiddenOnMobile">Karma/Member</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in topList" :key="index">
          <td>{{index + 1}}</td>
          <td>{{item.karma}}</td>
          <td>{{item.guildName}}</td>
          <td>{{item.memberCount}}</td>
          <td class="hiddenOnMobile">{{Number.isSafeInteger(Number.parseInt(item.karma / item.memberCount)) ? (item.karma / item.memberCount).toFixed(2) : 0}}</td>
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
    console.log(this.$cookies.get("userName"))
    this.topList = await this.$axios.$get("/api/v1/toplists/guilds");
  }
}
</script>

<style lang="sass" scoped>
#topListGuildsDiv
  display: flex
  align-content: center
  justify-content: center
  flex-direction: column
  text-align: center
</style>