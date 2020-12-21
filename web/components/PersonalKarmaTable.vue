<template>
  <div id="wrapper">
    <p>Hello subject {{userId}}, you found something that will be implemented very soon! Congratulations :)</p>
  </div>
</template>

<script>
export default {
  data: () => {

  },
  props: ["userId"]
}
</script>

<style lang="sass" scoped>
#wrapper
  display: flex
  align-content: center
  justify-content: center
</style>