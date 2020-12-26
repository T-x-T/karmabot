<template>
  <div id="pageWrapper">
    <Header />
    <div id="wrapper">
      <div id="controls">
        <div><button @click="activeElement='topListUsers'">Top Users</button></div>
        <div><button @click="activeElement='topListGuilds'">Top Servers</button></div>
        <div><button @click="activeElement='historyTotalkarma'">Total Karma History</button></div>
        
        <div v-if="loggedIn"><button @click="activeElement='userKarma'">Your Karma</button></div>
        <div v-if="loggedIn"><button @click="activeElement='userKarmaHistory'">Your Karma History</button></div>
        <div v-if="loggedIn"><button @click="activeElement='rank'">Your Ranks</button></div>
      </div>
      <div class="loginControl" v-if="loggedIn"><button :title="`You're logged in as ${this.userName}`" v-if="loggedIn" @click="logout">Logout</button></div>
      <div class="loginControl" v-if="!loggedIn"><a href="https://discord.com/oauth2/authorize?client_id=779060613590548521&redirect_uri=https%3A%2F%2Fthetxt.io%2Fapi%2Fv1%2Flogin&response_type=code&scope=identify">Login</a></div>
      <div id="main">
        <div class="centered" v-if="activeElement === 'topListUsers'">
          <TopListUsers class="topList" :userId="userId" />
        </div>
        <div class="centered" v-if="activeElement === 'topListGuilds'">
          <TopListGuilds class="topList" />
        </div>
        <div class="chart" v-if="activeElement === 'historyTotalkarma'">
          <HistoryTotalkarma />
        </div>
        <div class="centered" v-if="activeElement === 'userKarma'">
          <PersonalKarmaTable class="topList" :userId="userId" />
        </div>
        <div class="chart" v-if="activeElement === 'userKarmaHistory'">
          <HistoryPersonalKarma :userId="userId" />
        </div>
        <div class="chart" v-if="activeElement === 'rank'">
          <StatsRanks :userId="userId" />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data: () => ({
    activeElement: "topListUsers",
    loggedIn: false,
    userName: null,
    userId: null
  }),
  methods: {
    logout: function() {
      this.loggedIn = false;
      this.userName = null;
      this.userId = null;
      this.$cookies.remove("userName");
      this.$cookies.remove("userId");
    }
  },
  mounted (){
    if(this.$cookies.get("userName")){
      this.userName = this.$cookies.get("userName");
      this.userId = this.$cookies.get("userId", {parseJSON: false});
      this.loggedIn = true;
    }
  }
}
</script>

<style lang="sass" scoped>
@import ../assets/colors
#wrapper
  @media screen and ($smallScreen)
    padding-bottom: 50px
  @media screen and ($largeScreen)
    display: flex
    max-width: 100%
    padding-bottom: 18px
    min-height: 100%

#pageWrapper
  @media screen and ($largeScreen)
    height: 93.5vh

#controls
  padding: 25px
  display: flex
  flex-direction: column
  flex-shrink: 0
  @media screen and ($smallScreen)
    flex-direction: row
  @media screen and ($largeScreen)
    background-color: $darkester
    box-shadow: 10px 0px 50px 5px $darkester
  button:hover, a:hover
    cursor: pointer
    box-shadow: 0px 0px 20px $bright
  button, p, a
    margin: 10px
    padding: 10px
    font-size: 20pt
    background-color: $darkester
    color: white
    border: 2px solid $bright
    box-shadow: 0px 0px 5px $bright
    transition-duration: 0.1s
    @media screen and ($smallScreen)
      height: 100%

.loginControl
  a, button
    margin: 10px
    padding: 10px
    font-size: 20pt
    background-color: $darkester
    color: white
    border: 2px solid $bright
    box-shadow: 0px 0px 5px $bright
    position: fixed
    z-index: 3
    bottom: 25px
    left: 10px
    @media screen and ($smallScreen)
      bottom: 47px
      left: 15px
      font-size: 40pt
      padding: 20px
  button:hover, a:hover
    cursor: pointer
    box-shadow: 0px 0px 20px $bright

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

#main
  margin-top: 25px
  @media screen and ($largeScreen)
    flex-grow: 1
    overflow: hidden
</style>