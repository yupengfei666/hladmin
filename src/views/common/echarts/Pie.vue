<script setup lang="ts">
  import * as echarts from "echarts"
  import { toRefs, watch, onMounted, type PropType } from "vue"

  const props = defineProps({
    id: {
      type: String,
      default: "",
    },
    sData: {
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
  const { id, sData, height, configM } = toRefs(props)
  watch(sData, () => {
    draw()
  })
  function draw() {
    const option = {
      tooltip: {
        trigger: "item",
      },
      grid: {
        top: "2%",
        bottom: "2%",
      },
      legend: {
        textStyle: {
          color: "white",
        },
        show: false,
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "70%",
          data: sData.value,
          label: {
            fontSize: 16,
            color: "white",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id.value))
    myChart.clear()
    myChart.setOption(option)
  }
  onMounted(() => {
    // draw()
  })
</script>
<template>
  <div :style="{ height: height }" :id="id"></div>
</template>
