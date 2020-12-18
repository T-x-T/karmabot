<template>
  <div id="indexWrapper">
    <Header />
    <div id="indexMain">
      <div id="topBox">
        <div id="GetStarted">
          <GetStarted />
        </div>
      </div>
      <div id="History">
        <h1 class="accent">History</h1>
        <HistoryTotalkarma />
      </div>
      <div id="Introduction">
        <Introduction />
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
  @media screen and ($largeScreen)
    height: 100%
    width: 100%
    position: absolute
  @media screen and ($smallScreen)
    overflow: hidden
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