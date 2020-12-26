<template>
  <div id="wrapper">
    <table class="topListTable">
      <caption><h1 class="accent">Your server Ranks (
        <select v-model="currentTable">
          <option value="local" selected>local</option>
          <option value="global">global</option>
        </select>
        ):</h1></caption>
      <thead>
        <th>Server</th>
        <th>Rank</th>
      </thead>
      <tbody>
        <tr v-for="(item, index) in currentData" :key="index">
          <td>{{item.guildName}}</td>
          <td>{{item.guildRank}}</td>
        </tr>
      </tbody>
    </table>
    <p class="description" v-if="currentTable === 'local'">The local rank counts the karma you gained in each guild.</p>
    <p class="description" v-if="currentTable === 'global'">The global rank counts all karma you gained.</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTable: "local",
      currentData: null
    }
  },
  props: {
    userId: String
  },
  mounted: function(){
    this.update();
  },
  watch: {
    currentTable: function(){
      this.update();
    }
  },
  methods: {
    update: async function(){
      if(this.currentTable === "global"){
        this.currentData = await this.$axios.$get(`/api/v1/rank/user/${this.userId}/guilds/global`);
      }else{
        this.currentData = await this.$axios.$get(`/api/v1/rank/user/${this.userId}/guilds/local`);
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import ../assets/colors
#wrapper
  display: flex
  align-content: center
  flex-direction: column

select
  background-color: $darkest
  color: $bright
  border: 1px solid $bright
  border-radius: 10px
  font-family: inherit
  font-size: inherit
  cursor: inherit
  line-height: inherit
  cursor: pointer
  option
    color: $brighter

p.description
  text-align: center
  margin: 10px
</style>