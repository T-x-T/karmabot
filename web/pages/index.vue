<template>
  <main>
    <Header />
    <div id="topBox">
      <div id="GetStarted">
        <GetStarted />
      </div>
    </div>
    <div id="topListBox">
      <TopListUsers class="topList" />
      <div id="topListSpacer"></div>
      <TopListGuilds class="topList" />
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
#topBox
  display: flex
  justify-content: center
  flex-direction: row
  padding-top: 15px

#GetStarted
  width: 100%

#topListBox
  display: flex
  justify-content: center
  padding-top: 50px
  @media screen and ($largeScreen)
    flex-direction: row
  @media screen and ($smallScreen)
    flex-direction: column
    #topListSpacer
      display: none
    .topList
      padding-bottom: 100px
    
  #topListSpacer
    width: 10%
</style>