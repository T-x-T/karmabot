<template>
  <div id="GetStartedWrapper">
    <h1 class="accent" id="GetStartedHeader">Get Txt's Karmabot</h1>

    <div id="GetStartedFlexbox">
      <div class="GetStartedItem">
        <h2>Step 1:</h2>
        <a id="inviteMe" href="https://discord.com/oauth2/authorize?client_id=779060613590548521&scope=bot&permissions=1073859648" target="_blank">Invite me</a>
      </div>
      <div class="GetStartedItem">
        <h2>Step 2:</h2>
        <p>Set default vote emojis</p>
        <pre>+karma config server upvote default</pre>
        <pre>+karma config server downvote default</pre>
      </div>
      <div class="GetStartedItem">
        <h2>Step 3:</h2>
        <p>Look at the help and info</p>
        <pre>+karma help</pre>
        <pre>+karma info</pre>
      </div>
      <div class="GetStartedItem">
        <h2>Step 4:</h2>
        <p class="accent">Get to voting!</p>
        <p>Also don't forget to vote for this bot on <a class="accent" href="https://top.gg/bot/779060613590548521" title="https://top.gg/bot/779060613590548521">top.gg</a> ;)</p>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import ../assets/colors

#GetStartedWrapper
  width: inherit
  padding-bottom: 25px

#GetStartedHeader
  padding-bottom: 25px
  text-align: center
  @media screen and ($smallScreen)
    font-size: 40pt

#inviteMe
  font-size: 30pt
  margin-top: 10px
  padding-top: 5px
  padding-bottom: 5px
  padding-left: 35px
  padding-right: 35px
  border-radius: 25px
  background-color: $darker
  color: $bright
  border: 2px solid $bright
  box-shadow: 0px 0px 5px $bright
  @media screen and ($smallScreen)
    font-size: 45pt
  &:hover
    cursor: pointer
    background-color: $darkest
    user-select: none
    box-shadow: 0px 0px 15px $bright

h2
  font-size: 20pt
  padding: 5px
  @media screen and ($smallScreen)
    font-size: 30pt

p
  font-size: 12pt
  @media screen and ($smallScreen)
    font-size: 20pt

pre
  font-size: 14pt
  background-color: #202425
  @media screen and ($smallScreen)
    font-size: 30pt

#GetStartedFlexbox
  display: flex
  align-items: top
  justify-content: space-evenly
  flex-wrap: wrap
  @media screen and ($smallScreen)
    flex-direction: column
    padding-top: 10px
    padding-bottom: 10px
    width: 100%
  @media screen and ($largeScreen)
    flex-direction: row

.GetStartedItem
  display: flex
  flex-direction: column
  align-items: center
  padding-left: 20px
  padding-right: 20px
  margin: 10px
  margin-bottom: 50px
  background-color: $darker
  box-shadow: 0px 0px 10px 10px $darker
  width: 400px
  @media screen and ($smallScreen)
    width: 100%
    margin-top: 10px
    margin-bottom: 10px
    padding: 10px
   
</style>