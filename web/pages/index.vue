<template>
  <div id="indexWrapper">
    <Header />
    <div id="indexContent">
      <div id="indexMain">
        <p id="introductionText">Txt's Karmabot is a Discord bot which adds a karma system similar to Reddit to your Discord server.<br>It is implemented with reactions, but features lots of commands to view different statistics beautifully.</p>
        <div id="GetStarted">
          <GetStarted />
        </div>
        <div id="History">
          <h1 class="accent">History</h1>
          <HistoryTotalkarma />
        </div>
        <div id="Introduction">
          <Introduction />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "Hello World!"
    }
  },
  head() {
    return {
      title: "TxT's Karmabot"
    }
  }
}
</script>

<style lang="sass">
@import ../assets/colors

#indexWrapper
  @media screen and ($smallScreen)
    overflow: hidden

#indexContent
  margin-top: 25px
  padding-bottom: 30px

#GetStarted
  display: flex
  justify-content: center
  flex-direction: row
  padding-top: 15px
  width: 100%

#introductionText
  text-align: center
  font-size: 20pt
  @media screen and ($largeScreen)
    max-width: 50%
  @media screen and ($smallScreen)
    max-width: 100%

#Introduction
  width: 100%

#History
  background-color: $darkester
  box-shadow: 0px 0px 10px 10px $darkester
  margin-top: 1%
  margin-bottom: 1%
  width: 100%
  height: 50%
  h1
    text-align: center
    @media screen and ($smallScreen)
      font-size: 40pt

#indexMain
  @media screen and ($largeScreen)
    display: flex
    align-items: center
    justify-content: center
    flex-flow: column
    height: 90%

</style>