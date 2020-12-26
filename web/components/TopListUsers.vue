<template>
  <div id="topListUsersDiv">
    <h1 v-if="!rank" class="accent">Top Users:</h1>
    <h1 v-if="rank" class="accent">Top Users (You are {{rank}}.):</h1>
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
      topList: [],
      rank: null
    }
  },
  props:{
    userId: String
  },
  async fetch(){
    this.topList = await this.$axios.$get("/api/v1/toplists/users");
    this.loadRank();
  },
  methods: {
    async loadRank() {
      if(this.userId) this.rank = (await this.$axios.$get(`/api/v1/rank/user/${this.userId}/global`)).globalRank;
    }
  },
  mounted() {
    this.loadRank();
  }
}
</script>

<style lang="sass" scoped>
#topListUsersDiv
  display: flex
  align-content: center
  justify-content: center
  flex-direction: column
  text-align: center
</style>