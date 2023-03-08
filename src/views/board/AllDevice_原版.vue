<script lang="ts" setup>
  import { ref } from "vue"
  import * as echarts from "echarts"
  import BoardMain from "../common/BoardMain.vue"
  import { onMounted } from "vue"
  import request from "../../common/request"
  import BoardMachineBox from "@/views/common/BoardMachineBox.vue"
  import _ from "lodash-es"
  const deviceArr = ref([])
  const deviceTotal = ref(0)
  const rightBoxTj = ref([
    {
      class: "green-box",
      status: "运行",
      count: 0,
    },
    {
      class: "yellow-box",
      status: "暂停",
      count: 0,
    },
    {
      class: "red-box",
      status: " 报警",
      count: 0,
    },
    {
      class: "grey-box",
      status: "计划停机",
      count: 0,
    },
  ])
  const boxTjIndex = {
    "#45b23d": 0,
    "#e07a30": 1,
    "#e10f71": 2,
    "#767171": 3,
  }
  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    // 按照吨位 从小到大排序
    res.list = _.sortBy(res.list, ["tons"])
    console.log(1232314)
    console.log(res.list)
    deviceTotal.value = res.total
    for (const item of res.list) {
      if (!item.status) {
        continue
      }
      item.mould_detail = JSON.parse(item.mould_detail || "[]")
      const mouldTemp = _.uniq(_.map(item.mould_detail, "category_name")).join()
      const tempA = mouldTemp.split(",")
      if (tempA.length > 1) {
        item.showCategorys = tempA[0] + "+"
      } else {
        item.showCategorys = mouldTemp
      }
      const temp = {
        id: item.id,
        name: item.name,
        color: item.color,
        type: item.isError !== "否" ? item.statusName : "",
        jdl: Math.floor(Math.random() * 100),
        completeI: item.count,
        totalI: item.quantity,
        jz: item.machine_Name,
        jzName: item.showCategorys,
      }
      deviceArr.value.push(temp)
      rightBoxTj.value[boxTjIndex[item.color]].count++
    }
  }
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
  onMounted(() => {
    drawYbp("sbkdl", 76.5)
    drawYbp("sbjdl", 62.4)
  })
</script>
<template>
  <div id="allDevice">
    <BoardMain title="成形设备生产状况总览">
      <template #left>
        <div style="display: flex">
          <div>成型机: {{ deviceTotal }}</div>
        </div>
      </template>
      <template #context>
        <div style="display: flex">
          <div
            style="
              width: calc(100% - 280px);
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 8px;
            "
          >
            <BoardMachineBox
              :machine="item"
              v-for="item in deviceArr"
              :key="item.id"
            ></BoardMachineBox>
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
                >{{ deviceTotal }}</div
              >
            </div>
            <div
              class="right-box"
              style="margin-top: 3px"
              v-for="item in rightBoxTj"
              :key="item.class"
            >
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
