<template>
  <nav>
    <ul>
      <li>
        <NuxtLink to="/">Home</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats">Statistics</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/docs">Docs</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about">About</NuxtLink>
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
    padding-left: 25px
    padding-right: 25px
    padding-bottom: 5px
    padding-top: 5px
    font-size: 30pt
    @media screen and ($smallScreen)
      font-size: 60pt
    &:hover
      background-color: $darkest
    a
      display: table
      margin: 0 auto
</style>