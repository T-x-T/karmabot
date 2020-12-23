<template>
  <nav>
    <ul>
      <li>
        <NuxtLink class="headerLink" to="/">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink class="headerLink" to="/stats">Stats</NuxtLink>
      </li>
      <li>
        <NuxtLink class="headerLink" to="/docs">Docs</NuxtLink>
      </li>
      <li>
        <NuxtLink class="headerLink" to="/about">About</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="sass">
@import ../assets/colors
nav
  position: sticky
  top: 0px
  z-index: 2
  background-color: $darker
  box-shadow: 0px 15px 10px -10px $bright
  ul
    display: flex
    justify-content: center
    padding: 0
  li
    flex-grow: 0.1
    list-style-type: none
    padding: 5px
    font-size: 30pt
    @media screen and ($smallScreen)
      font-size: 50pt
    &:hover
      background-color: $darkest
    a
      display: table
      margin: 0 auto
    .headerLink
      width: 100%
      text-align: center  
</style>