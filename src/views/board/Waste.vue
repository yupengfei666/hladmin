<script lang="ts" setup>
  import dayjs from "dayjs"
  import { ref } from "vue"
  import * as echarts from "echarts"

  import { onMounted } from "vue"
  const currentTime = ref("")

  function showDate() {
    const weekT = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    currentTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss") + " " + weekT[dayjs().day()]
    setInterval(() => {
      currentTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss") + " " + weekT[dayjs().day()]
    }, 1000)
  }
  showDate()

  const deviceArr = ref([])
  for (let i = 1; i <= 77; i++) {
    const temp = {
      name: i + "",
      shadow: "",
      type: "",
      jdl: Math.floor(Math.random() * 100),
    }
    if (i === 34 || i === 50) {
      temp.shadow = "card-shadow-red"
    } else if (i === 10 || i === 56) {
      temp.shadow = "card-shadow-yellow"
      temp.type = "模具切换"
      if (i === 56) {
        temp.type = "设备修理"
      }
    } else if (i === 21 || i === 22 || i === 23) {
      temp.shadow = "card-shadow-grey"
    } else {
      temp.shadow = "card-shadow-green"
    }
    deviceArr.value.push(temp)
  }
  const rightBoxTj = ref([
    {
      class: "green-box",
      status: "运行",
      count: 50,
    },
    {
      class: "yellow-box",
      status: "暂停",
      count: 5,
    },
    {
      class: "red-box",
      status: " 报警",
      count: 15,
    },
    {
      class: "grey-box",
      status: "计划停机",
      count: 7,
    },
  ])
  function drawYbp(id, value) {
    const option = {
      series: [
        {
          type: "gauge",
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.3, "#FF545C"],
                [0.7, "#FFCB41"],
                [1, "#42F58E"],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: "auto",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            distance: -12,
            length: 12,
            lineStyle: {
              color: "#fff",
              width: 2,
            },
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            formatter: "{value} %",
            color: "auto",
            fontSize: 25,
          },
          data: [
            {
              value: value,
            },
          ],
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id))
    myChart.clear()
    myChart.setOption(option)
  }
  onMounted(() => {
    drawYbp("sbkdl", 76.5)
    drawYbp("sbjdl", 62.4)
  })
</script>
<template>
  <div class="backAll">
    <header
      style="
        display: flex;
        justify-content: space-between;
        padding-bottom: 4px;
        border-bottom: 1px solid white;
      "
    >
      <div style="display: flex; align-items: center">
        <img src="../../../public/img/logo.png" alt="" style="width: 50px" />
        <div>
          <div>CHPAVC</div>
          <div>形成课稼动管理系统</div>
        </div>
      </div>
      <div class="head-title">成形设备生产稼动状况</div>
      <div style="margin-top: 25px">
        <div>{{ currentTime }}</div>
      </div>
    </header>
    <main style="display: flex">
      <div
        style="
          width: calc(100% - 280px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 8px;
        "
      >
        <div class="device-card" :class="item.shadow" v-for="item in deviceArr" :key="item.name">
          <div>
            <span class="name">{{ item.name }}</span>
            <span style="margin-left: 6px">{{ item.type }}</span>
          </div>
          <div style="display: flex; font-size: 12px; padding-top: 8px">
            <div>
              <div>计划：5000</div>
              <div>差异：500</div>
            </div>
            <div style="margin-left: 22px; margin-top: -2px">
              <el-progress
                stroke-width="5"
                :show-text="false"
                width="35"
                color="#61D842"
                type="circle"
                :percentage="item.jdl"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        style="
          width: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
        "
      >
        <div class="right-box">
          <div
            class="left-content flex-center"
            style="background-image: linear-gradient(to right, #1261a9, transparent)"
            >成型机</div
          >
          <div
            style="
              width: calc(100% - 190px);
              display: flex;
              justify-content: center;
              align-items: center;
            "
            >77台</div
          >
        </div>
        <div class="right-box" style="margin-top: 3px" v-for="item in rightBoxTj" :key="item.class">
          <div class="left-content">
            <div :class="item.class"></div>
            <div style="width: calc(100% - 95px)" class="flex-center"> {{ item.status }} </div>
          </div>
          <div class="flex-center" style="width: calc(100% - 190px)">{{ item.count }}台</div>
        </div>
        <!-- 展示稼动率 -->
        <div>
          <div>
            <div id="sbkdl" style="height: 200px; width: 280px"> </div>
            <div class="draw-button"> 设备开动率 </div>
          </div>
          <div>
            <div id="sbjdl" style="height: 200px; width: 280px"> </div>
            <div class="draw-button"> 设备稼动率 </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="less" scoped>
  @green: #45b23d;
  @yellow: #e07a30;
  @red: #e10f71;
  @grey: #767171;
  .draw-button {
    background-color: #45b23d;
    padding: 5px;
    border-radius: 5px;
    width: 82px;
    font-weight: bold;
    margin: 0 auto;
    margin-top: -47px;
  }
  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-box {
    width: 280px;
    height: 60px;
    border: 2px solid #699cca;
    display: flex;
    font-size: 18px;
    font-weight: bold;
    .left-content {
      width: 190px;
      display: flex;
      border-right: 1px dashed #699cca;
      .green-box {
        width: 95px;
        background-color: @green;
      }
      .yellow-box {
        width: 95px;
        background-color: @yellow;
      }
      .red-box {
        width: 95px;
        background-color: @red;
      }
      .grey-box {
        width: 95px;
        background-color: @grey;
      }
    }
  }
  .backAll {
    background: url(../../../public/img/bg.jpg) no-repeat;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    position: relative;
    color: white;
    padding: 10px;
    box-sizing: border-box;
  }
  .head-title {
    text-align: center;
    margin-top: 6px;
    font-size: 26px;
    text-shadow: #5b8bb6 0 0 10px;
    color: white;
    letter-spacing: 12px;
  }
  .device-card {
    width: 130px;
    height: 65px;
    display: inline-block;
    margin: 5px;
    padding: 6px;
    .name {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .card-shadow-green {
    box-shadow: 0px 0px 5px white;
    background-color: @green;
  }
  .card-shadow-red {
    box-shadow: 0px 0px 5px white;
    background-color: #e10f71;
  }
  .card-shadow-yellow {
    box-shadow: 0px 0px 5px white;
    background-color: #e07a30;
  }
  .card-shadow-grey {
    box-shadow: 0px 0px 5px white;
    background-color: #767171;
  }
</style>
