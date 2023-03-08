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
          xXAisLabelRotate: 0, // x轴文字旋转
          seriesLabelFormatter: "%", // 柱上方数据单位
          yAxisShow: false, // 是否显示y轴
          yAxisName: "",
        }
      },
    },
  })
  const { id, xData, yData, height, configM } = toRefs(props)
  const emit = defineEmits(["onclickItem"])
  watch(yData, (val) => {
    draw()
  })
  function draw() {
    console.log(configM.value.xXAisLabelRotate)

    const option = {
      backgroundColor: "", // 设置无背景色
      grid: {
        // top: 30,
        // y2: 40,
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
          // barWidth: 30,
          label: {
            show: true,
            position: "top",
            color: "white",
            formatter: function (val) {
              return val.value + configM.value.seriesLabelFormatter
            },
          },
          itemStyle: {
            color: "#188df0",
          },
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id.value))
    myChart.clear()
    myChart.setOption(option)
    myChart.on("click", function (param) {
      //获取自定义变量barIds的值,barIds要和option的series里自定义的一样
      emit("onclickItem", param.data)
    })
  }
  onMounted(() => {
    // draw()
  })
</script>
<template>
  <div :style="{ height: height }" :id="id"></div>
</template>
