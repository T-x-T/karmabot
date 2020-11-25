<template>
  <div>
    <h1 class="accent" id="GetStartedHeader">How to get Txt's Karmabot into your server:</h1>

    <div id="GetStartedFlexbox">
      <div class="GetStartedItem">
        <h2>Step 1:</h2>
        <a id="inviteMe" href="https://discord.com/oauth2/authorize?client_id=779060613590548521&scope=bot&permissions=1073859648" target="_blank">Invite me</a>
      </div>
      <div class="GetStartedItem">
        <h2>Step 2:</h2>
        <p>Set default upvote emoji</p>
        <pre>+karma config server upvote default</pre>
      </div>
      <div class="GetStartedItem">
        <h2>Step 3:</h2>
        <p>Set default downvote emoji</p>
        <pre>+karma config server downvote default</pre>
      </div>
      <div class="GetStartedItem">
        <h2>Step 4:</h2>
        <p>Look at the help and info</p>
        <pre>+karma help</pre>
        <pre>+karma info</pre>
      </div>
      <div class="GetStartedItem">
        <h2>Step 5:</h2>
        <p class="accent">Get to voting!</p>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import ../assets/colors

#GetStartedHeader
  margin: 5px
  margin-left: 15px
  @media screen and ($smallScreen)
    font-size: 40pt

#inviteMe
  font-size: 35pt
  margin-top: 10px
  padding-top: 10px
  padding-bottom: 10px
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
  font-size: 15pt
  background-color: #202425
  @media screen and ($smallScreen)
    font-size: 30pt

.accent
  color: $bright

#GetStartedFlexbox
  display: flex
  align-items: top
  padding-bottom: 25px
  box-shadow: 0px 15px 10px -10px $bright
  @media screen and ($smallScreen)
    flex-direction: column
  @media screen and ($largeScreen)
    flex-direction: row

.GetStartedItem
  display: flex
  flex-direction: column
  align-items: center
  flex-grow: 1
   
</style>