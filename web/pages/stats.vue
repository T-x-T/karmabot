<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="topbox">
        <button @click="activeElement='topListUsers'">Top Users</button>
        <button @click="activeElement='topListGuilds'">Top Guilds</button>
        <button @click="activeElement='historyTotalkarma'">Total Karma History</button>
      </div>
      <div v-if="activeElement === null">
        <p>Click one of the buttons above to get started!</p>
      </div>
      <div class="centered" v-if="activeElement === 'topListUsers'">
        <h1 class="accent">Top Users:</h1>
        <TopListUsers class="topList" />
      </div>
      <div class="centered" v-if="activeElement === 'topListGuilds'">
        <h1 class="accent">Top Servers:</h1>
        <TopListGuilds class="topList" />
      </div>
      <div class="chart" v-if="activeElement === 'historyTotalkarma'">
        <h1 class="accent">Total Karma History:</h1>
        <HistoryTotalkarma />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data: () => ({
    activeElement: "topListUsers"
  })
}
</script>

<style lang="sass" scoped>
@import ../assets/colors
#wrapper
  padding-bottom: 50px
#topbox
  margin: 25px
  button
    margin: 10px
    padding: 10px
    font-size: 20pt
    background-color: $darkester
    color: white
    border: 2px solid $bright
    box-shadow: 0px 0px 5px $bright
h1
  text-align: center

.centered
  display: flex
  justify-content: center
  align-content: center
  flex-direction: column

.chart
  width: 90%
  height: 75%

div.chart
  width: 100%

p
  margin: 35px
</style>