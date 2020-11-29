<template>
  <main>
    <Header />
    <div id="topBox">
      <div id="Introduction">
        <Introduction />
      </div>
      <div id="GetStarted">
        <GetStarted />
      </div>
    </div>
    <div id="topListBox">
      <div>
        <h1 class="accent">Top Users:</h1>
        <TopListUsers class="topList" />
      </div>
      <div id="topListSpacer"></div>
      <div>
        <h1 class="accent">Top Servers:</h1>
        <TopListGuilds class="topList" />
      </div>
    </div>
    <Footer />
  </main>
</template>

<script>
export default {
  data() {
    return {
      message: "Hello World!"
    }
  }
}
</script>

<style lang="sass">
@import ../assets/colors
#GetStarted
  display: flex
  justify-content: center
  flex-direction: row
  padding-top: 15px
  width: 100%

#Introduction
  width: 100%

#topBox
  width: 100%

#topListBox
  display: flex
  justify-content: center
  padding-top: 50px
  padding-bottom: 25px
  @media screen and ($largeScreen)
    flex-direction: row
  @media screen and ($smallScreen)
    flex-direction: column
    #topListSpacer
      display: none
    .topList
      padding-bottom: 100px
    
  #topListSpacer
    width: 5%
</style>