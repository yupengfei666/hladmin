<script setup lang="ts">
  import * as echarts from "echarts"
  import { toRefs, watch, onMounted } from "vue"
  const props = defineProps({
    id: {
      type: String,
      default: "",
    },
    xData: {
      type: Array,
      default: () => [],
    },
    yData: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: "100%",
    },
    configM: {
      type: Object,
      default() {
        return {
          xXAisLabelRotate: 0,
          seriesLabelFormatter: "%",
          yAxisShow: false,
        }
      },
    },
  })
  const { id, xData, yData, height, configM } = toRefs(props)
  watch(yData, (val) => {
    draw()
  })
  function draw() {
    console.log(configM.value.xXAisLabelRotate)

    const option = {
      backgroundColor: "", // 设置无背景色
      grid: {
        top: 30,
        y2: 40,
      },
      xAxis: {
        type: "category",
        data: xData.value,
        splitLine: {
          show: false,
        },
        axisLabel: {
          rotate: 0,
          color: "white",
          margin: 18,
          formatter: function (value, index) {
            const v = value.substring(0, 6) + "..."
            return value.length > 7 ? v : value
          },
        },
      },
      yAxis: {
        type: "value",
        show: configM.value.yAxisShow,
        nameTextStyle: {
          color: "white",
        },
        name: configM.value.yAxisName,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value}",
          color: "white",
          fontSize: 16,
        },
      },
      tooltip: {
        show: true,
      },
      series: [
        {
          data: yData.value,
          type: "bar",
          barWidth: 30,
          label: {
            show: true,
            position: "top",
            color: "white",
            formatter: function (val) {
              return val.value + configM.value.seriesLabelFormatter
            },
            // formatter: flag
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#83bff6",
              },
              {
                offset: 0.5,
                color: "#188df0",
              },
              {
                offset: 1,
                color: "#188df0",
              },
            ]),
          },
        },
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [30, 13],
          symbolOffset: [0, -6], // 上部椭圆
          symbolPosition: "end",
          z: 12,
          itemStyle: {
            color: "#1998ff",
          },
          data: yData.value,
        },
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [35, 20],
          symbolOffset: [0, 10], // 下部外环
          z: 10,
          itemStyle: {
            normal: {
              color: "transparent",
              borderColor: "#83bff6",
              borderType: "solid",
              borderWidth: 8,
            },
          },
          data: yData.value,
        },
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [45, 20],
          symbolOffset: [0, 15], // 下部外环
          z: 10,
          itemStyle: {
            normal: {
              color: "transparent",
              borderColor: "#83bff6",
              borderType: "solid",
              borderWidth: 8,
            },
          },
          data: yData.value,
        },
        {
          name: "",
          type: "pictorialBar",
          symbolSize: [30, 13],
          symbolOffset: [0, 5], // 下部椭圆
          // "barWidth": "20",
          z: 12,
          itemStyle: {
            color: "#188df0",
          },
          data: yData.value,
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id.value))
    myChart.clear()
    myChart.setOption(option)
  }
  onMounted(() => {
    draw()
  })
</script>
<template>
  <div :style="{ height: height }" :id="id"></div>
</template>
