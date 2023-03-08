<script setup lang="ts">
  import * as echarts from "echarts"
  import { toRefs, watch, onMounted, type PropType } from "vue"

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
    configM: {
      type: Object,
      default() {
        return {
          xXAisLabelRotate: 0,
          yAxisName: "",
        }
      },
    },
    height: {
      type: String,
      default: "100%",
    },
  })
  const { id, xData, yData, height, configM } = toRefs(props)
  watch(yData, (val) => {
    draw()
  })
  function draw() {
    const option = {
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xData.value,
        axisLabel: {
          color: "white",
          fontSize: 16,
          rotate: configM.value.xXAisLabelRotate,
        },
      },
      grid: {
        top: 30,
        left: 70,
        bottom: 40,
        right: 40,
      },
      tooltip: {
        trigger: "axis",
        // formatter: "时间：{b}<br/>稼动率：{c} %",
        formatter: "时间：{b}<br/>耗电量：{c} kw·h",
      },
      yAxis: {
        type: "value",
        // name: "单位：kw·h",
        name: configM.value.yAxisName,
        nameTextStyle: {
          color: "white",
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value}",
          color: "white",
          fontSize: 16,
        },
      },
      series: [
        {
          data: yData.value,
          type: "line",
          itemStyle: {
            color: "#36cfc9",
          },
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id.value))
    myChart.clear()
    myChart.setOption(option)
    myChart.on("click", function (param) {
      console.log(param)

      // emit("onclickItem", param.data)
    })
  }
  onMounted(() => {
    draw()
  })
</script>
<template>
  <div :style="{ height: height }" :id="id"></div>
</template>
