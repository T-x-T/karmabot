<template>
  <div id="indexWrapper">
    <Header />
    <div id="indexMain">
      <div id="topIntro">
        <img src="~/assets/logo.svg" alt="logo" id="logo">
        <div id="logoTextWrapper">
          <p class="logoText accent">Encourage positive, funny and helpful content in your community using TxT's Karmabot.</p>
          <p class="logoText">Txt's Karmabot is a Discord bot which adds a karma system to your Discord server, simliar to Reddit.<br>It is implemented with reactions, but features lots of commands to view different statistics beautifully.</p>
        </div>
      </div>
      <div id="GetStarted">
        <GetStarted />
      </div>
      <div id="History">
        <h1 class="accent">History</h1>
        <HistoryTotalkarma />
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

img#logo
  width: 200px
  margin: 20px
  padding: 10px
  background-color: $darker
  box-shadow: 0px 0px 10px 10px $darker
  @media screen and ($smallScreen)
    align-self: center

#topIntro
  width: 80%
  display: flex
  flex-direction: row
  justify-content: center
  align-content: center
  margin-top: 50px
  @media screen and ($smallScreen)
    width: 100%
    flex-direction: column

#GetStarted
  display: flex
  justify-content: center
  flex-direction: row
  padding-top: 15px
  width: 100%

.logoText
  text-align: left
  font-size: 20pt
  @media screen and ($smallScreen)
    text-align: center

#logoTextWrapper
  display: flex
  flex-direction: column
  justify-content: space-evenly
  margin-left: 10px
  @media screen and ($largeScreen)
    max-width: 50%
  @media screen and ($smallScreen)
    max-width: 100%

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
  margin-top: 25px
  padding-bottom: 30px
  @media screen and ($largeScreen)
    display: flex
    align-items: center
    justify-content: center
    flex-flow: column
    height: 90%

</style>