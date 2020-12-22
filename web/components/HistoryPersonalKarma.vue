<template>
  <div id="wrapper">
    <LineChart
      v-if="loaded"
      style="height:100%"
      :chartdata="chartdata"
      :options="options"
    />
  </div>
</template>

<script>
import LineChart from "./LineChart.vue";
export default {
  components: { LineChart },
  props: {
    userId: String
  },
  data: () => ({
    loaded: false,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: "bottom"
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: 'day'
            },
            gridLines: false
          }
        ],
        yAxes: [
          {
            gridLines: false
          }
        ]
      }
    },
    chartdata: {
      label: "Your Total Karma",
      datasets: [
        {
          label: "Your Total Karma",
          data: [],
          borderColor: "rgba(255, 211, 105, 1)",
          pointHitRadius: 32,
          pointRadius: 0,
        }
      ]
    }
  }),
  async fetch () {
    try {
      const res = await this.$axios.$get(`/api/v1/history/userkarma/${this.userId}?hoursInPast=720`);
      const points = res.map(x => x.karma);
      const timestamps = res.map(x => new Date(x.timestamp));
      for(let i = 0; i < points.length; i++){
        this.chartdata.datasets[0].data.push({
          x: timestamps[i],
          y: points[i]
        });
      }
      this.loaded = true
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<style lang="sass" scoped>
@import ../assets/colors
div#wrapper
  padding-left: 1%
  padding-right: 1%
  width: 98%
  height: 90%
</style>