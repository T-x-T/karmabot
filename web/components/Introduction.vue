<template>
  <div id="IntroductionWrapper">
    <div id="IntroductionHeader">
      <h1 class="accent">What is TxT's Karmabot?</h1>
    </div>
    <div id="IntroductionFlexbox">
      <p>Vote on messages</p>
      <p>Receive votes</p>
      <p>Gain one karma per upvote</p>
      <p>Lose one karma per downvote</p>
    </div>
  </div>
</template>

<style lang="sass">
@import ../assets/colors

#IntroductionWrapper
  padding-top: 25px
  padding-bottom: 25px

#IntroductionHeader
  text-align: center
  @media screen and ($smallScreen)
    font-size: 40pt
  h1
    padding-bottom: 25px

#IntroductionFlexbox
  display: flex
  align-items: top
  align-content: space-evenly
  justify-content: space-evenly
  @media screen and ($smallScreen)
    flex-direction: column
    p
      max-width: 100%
  @media screen and ($largeScreen)
    flex-direction: row
    p
      max-width: 20%
  p
    padding: 0px
    font-size: 25pt
    text-align: center
    background-color: $darker
    box-shadow: 0px 0px 10px 10px $darker
    width: 20%
</style>