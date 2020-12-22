<template>
  <div>
    <Header />
    <div id="wrapper">
      <div id="topbox">
        <div><button @click="activeElement='topListUsers'">Top Users</button></div>
        <div><button @click="activeElement='topListGuilds'">Top Servers</button></div>
        <div><button @click="activeElement='historyTotalkarma'">Total Karma History</button></div>
        
        <div v-if="loggedIn"><button @click="activeElement='userKarma'">Your Karma</button></div>

        <div id="topboxLoginStart" v-if="loggedIn"><p>You're logged in as {{userName}}</p></div>
        <div v-if="loggedIn"><button v-if="loggedIn" @click="logout">Logout</button></div>

        <div id="topboxLoginStart" v-if="!loggedIn"><a href="https://discord.com/oauth2/authorize?client_id=779060613590548521&redirect_uri=https%3A%2F%2Fthetxt.io%2Fapi%2Fv1%2Flogin&response_type=code&scope=identify">Login</a></div>
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
      <div class="centered" v-if="activeElement === 'userKarma'">
        <h1 class="accent">Your Karma:</h1>
        <PersonalKarmaTable class="topList" :userId="userId" />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data: () => ({
    activeElement: "userKarma",
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
  padding-bottom: 50px
#topbox
  margin: 25px
  display: flex
  flex-direction: row
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

#topboxLoginStart
  margin-left: auto

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