<template>
  <div>
    <Header />
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
  </div>
</template>

<style lang="sass" scoped>
@import ../assets/colors
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