<script lang="ts" setup>
  import { ref, reactive } from "vue"
  import * as echarts from "echarts"
  import BoardMain from "../common/BoardMain.vue"
  import { onMounted, onUnmounted } from "vue"
  import request from "../../common/request"
  import Bar from "../common/echarts/Bar.vue"
  import PersonBox from "./PersonBox.vue"
  import { getCategorysByMouldDetail } from "@/common/common"
  import BoardBox from "../common/BoardBox.vue"
  import BoardMachineBox from "@/views/common/BoardMachineBox.vue"
  import _ from "lodash-es"
  const deviceArr = ref([])
  const deviceTotal = ref(0)
  const rightBoxTjInit = ref([
    {
      class: "green-box",
      status: "运行",
      count: 0,
    },
    {
      class: "yellow-box",
      status: "待机",
      count: 0,
    },
    {
      class: "red-box",
      status: "报警",
      count: 0,
    },
    {
      class: "grey-box",
      status: "计划停机",
      count: 0,
    },
  ])
  const boxTjIndex = {
    auto: 0,
    other: 1,
    error: 2,
    stop: 3,
  }
  let jdlByTons = []
  const rightBoxTj = ref([])
  const listByTons = ref([])
  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    deviceTotal.value = res.total
    deviceArr.value = []
    rightBoxTj.value = _.cloneDeep(rightBoxTjInit.value)
    for (const item of res.list) {
      if (!item.status) {
        continue
      }
      item.showCategorys = getCategorysByMouldDetail(item.mould_detail)
      const temp = {
        id: item.id,
        name: item.name,
        nameByOrder: item.name.slice(0, item.name.length - 1) * 1,
        color: item.color,
        type: item.isError !== "否" ? item.statusName : "",
        jdl: Math.floor(Math.random() * 100),
        completeI: item.count,
        totalI: item.quantity,
        jz: item.machine_Name,
        jzName: item.showCategorys,
        tons: item.tons,
        tonsByOrder: item.tons * 1,
      }
      deviceArr.value.push(temp)
      // 除了指定的 运行 报警 计划停机，其他都归为待机
      let tempIndex = boxTjIndex[item.flag] ? boxTjIndex[item.flag] : 1

      rightBoxTj.value[tempIndex].count++
    }
    // 按照吨位 从小到大排序 同吨位按照机床号从小打到排序
    // deviceArr.value = _.sortBy(deviceArr.value, ["tonsByOrder", "nameByOrder"])

    // 按照机床号 从小到大排序
    deviceArr.value = _.sortBy(deviceArr.value, ["nameByOrder"])

    const jdlByTonsT = _.groupBy(deviceArr.value, "tons")
    jdlByTons = []
    listByTons.value = []
    for (const [key, item] of Object.entries(jdlByTonsT)) {
      listByTons.value.push({
        name: key + "t",
        machineList: item,
      })
      let avgJdl = 0
      for (const itemJ of item) {
        avgJdl += itemJ.jdl
      }
      avgJdl = Number((avgJdl / item.length).toFixed(1))

      jdlByTons.push({
        ton: key + "t",
        avgJdl: avgJdl,
        avgKdl: avgJdl + 2,
      })
    }
    drawTj()
  }
  const dqd = reactive({
    xData: ["稼动率", "开动率"],
    yData: [14, 5],
  })
  getDeviceArr()

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
  const color = reactive({
    kdl: "#36cfc9",
    jdl: "#faad14",
  })
  function drawTj() {
    const yLabel = _.map(jdlByTons, "ton")
    const xKdl = _.map(jdlByTons, "avgKdl")
    const xJdl = _.map(jdlByTons, "avgJdl")
    const option = {
      title: {
        text: "World Population",
        show: false,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        textStyle: {
          color: "white",
        },
        top: 5,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "5%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
          color: "white",
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "category",
        data: yLabel,
        axisLabel: {
          color: "white",
          fontSize: "16",
        },
      },
      series: [
        {
          name: "开动率",
          type: "bar",
          data: xKdl,
          itemStyle: {
            color: color.kdl,
          },
          label: {
            show: true,
            position: "right",
            color: "white",
            formatter: function (val) {
              return val.value + "%"
            },
          },
        },
        {
          name: "稼动率",
          type: "bar",
          data: xJdl,
          itemStyle: {
            color: color.jdl,
          },
          label: {
            show: true,
            position: "right",
            color: "white",
            formatter: function (val) {
              return val.value + "%"
            },
          },
        },
      ],
    }
    const myChart = echarts.init(document.getElementById("tj"))
    // myChart.clear()
    myChart.setOption(option)
  }
  const timer = ref()
  onMounted(() => {
    timer.value = setInterval(() => {
      console.log(555)
      getDeviceArr()
    }, 1000 * 10)
  })
  onUnmounted(() => {
    clearInterval(timer.value)
  })
  const showByTons = ref(false)
</script>
<template>
  <div id="allDevice">
    <BoardMain title="成形设备生产状况总览">
      <template #left> </template>
      <template #context>
        <div style="height: 100%">
          <!-- 头 -->
          <div style="display: flex; align-items: center">
            <div style="display: flex; align-items: center">
              <div>按吨位查看</div>
              <el-switch style="margin-left: 8px; margin-top: 2px" v-model="showByTons" />
            </div>
            <div style="margin-left: 16px">成型机: {{ deviceTotal }}台</div>

            <div style="display: flex; margin-left: 8px">
              <div
                class="right-box"
                style="margin-top: 3px"
                v-for="item in rightBoxTj"
                :key="item.class"
              >
                <div class="left-content">
                  <div :class="item.class"></div>
                  <div class="flex-center" style="margin-left: 4px"> {{ item.status }} : </div>
                </div>
                <div class="flex-center" style="margin-left: 6px">{{ item.count }}台</div>
              </div>
            </div>
          </div>
          <!-- 下部 -->
          <div style="height: calc(100% - 35px)">
            <el-scrollbar>
              <div style="display: flex; height: calc(100vh - 105px)">
                <!-- 左 -->
                <div style="width: 80%; height: 100%; box-sizing: border-box">
                  <!-- 全部查 -->
                  <div v-if="!showByTons">
                    <el-scrollbar>
                      <div style="display: flex; flex-wrap: wrap">
                        <BoardMachineBox
                          :machine="item"
                          v-for="item in deviceArr"
                          :key="item.id"
                        ></BoardMachineBox>
                      </div>
                    </el-scrollbar>
                  </div>
                  <!-- 按吨位查 -->
                  <div
                    v-else
                    style="padding: 10px; height: 100%; min-height: 805px; box-sizing: border-box"
                  >
                    <PersonBox :list="listByTons"></PersonBox
                  ></div>
                </div>

                <!-- 右 -->
                <div
                  style="
                    width: 20%;
                    min-width: 280px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 10px;
                    justify-content: center;
                    overflow: hidden;
                  "
                >
                  <div style="height: 67.5%; width: 95%">
                    <BoardBox title="按吨位统计">
                      <div id="tj" style="height: 100%; width: 100%"> </div>
                    </BoardBox>
                  </div>
                  <div style="height: 1%"></div>
                  <div style="height: 31.5%; width: 95%; box-sizing: border-box">
                    <BoardBox title="总统计">
                      <div
                        style="
                          margin-top: 20%;
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          font-size: 30px;
                        "
                      >
                        <div>
                          <span> 开动率： </span>
                          <span style="font-weight: bold" :style="{ color: color.kdl }"> 20% </span>
                        </div>
                        <div>
                          <span> 稼动率： </span>
                          <span style="font-weight: bold" :style="{ color: color.jdl }"> 15% </span>
                        </div>
                      </div>
                    </BoardBox>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </template>
    </BoardMain>
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
  .circle {
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .right-box {
    width: 140px;
    display: flex;
    align-items: center;
    font-size: 16px;
    // font-weight: bold;
    .left-content {
      // width: 90px;
      display: flex;
      align-items: center;
      .green-box {
        .circle();
        background-color: @green;
      }
      .yellow-box {
        .circle();
        background-color: @yellow;
      }
      .red-box {
        .circle();
        background-color: @red;
      }
      .grey-box {
        .circle();
        background-color: @grey;
      }
    }
  }

  .card-shadow-green {
    background-color: @green;
  }
  .card-shadow-red {
    background-color: @red;
  }
  .card-shadow-yellow {
    background-color: @yellow;
  }
  .card-shadow-grey {
    box-shadow: 0px 0px 5px white;
    background-color: @grey;
  }
</style>
