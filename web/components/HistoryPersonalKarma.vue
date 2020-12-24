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
      const resTotal = await this.$axios.$get(`/api/v1/history/userkarma/${this.userId}?hoursInPast=720`);
      const resGuilds = await this.$axios.$get(`/api/v1/history/users/${this.userId}/guildkarma?hoursInPast=720`);
      const pointsTotal = resTotal.map(x => x.karma);
      const timestampsTotal = resTotal.map(x => new Date(x.timestamp));
      for(let i = 0; i < pointsTotal.length; i++){
        this.chartdata.datasets[0].data.push({
          x: timestampsTotal[i],
          y: pointsTotal[i]
        });
      }
      for(let i = 0; i < resGuilds.length; i++){
        let data = [];
        this.chartdata.datasets.push({
          data: data,
          label: resGuilds[i].guildName,
          borderColor: `rgba(${255 - ((i + 1) * 48)}, ${211 - ((i + 1) * 16)}, ${105 - ((i + 1) * 8)}, 1)`,
          pointHitRadius: 32,
          pointRadius: 0
        });
        for(let j = 0; j < resGuilds[i].guildkarmaHistory.length; j++){
          data.push({
            x: resGuilds[i].guildkarmaHistory[j].timestamp,
            y: resGuilds[i].guildkarmaHistory[j].karma
          });
        }
      }
      console.log(this.chartdata)
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