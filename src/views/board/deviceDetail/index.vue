<script lang="ts" setup>
  import { ref, reactive } from "vue"
  import * as echarts from "echarts"
  import BoardMain from "../../common/BoardMain.vue"
  import BoardBox from "../../common/BoardBox.vue"
  import StatusLine from "../../common/StatusLine.vue"
  import BarCommon from "../../common/echarts/BarCommon.vue"
  import Line from "../../common/echarts/Line.vue"
  import { onMounted } from "vue"
  import dayjs from "dayjs"
  import { useRouter, useRoute } from "vue-router"
  import request from "../../../common/request"
  import FileDailog from "./FileDailog.vue"
  import _ from "lodash-es"
  import statusChangeDialog from "../common/StatusChangeDialog.vue"

  const router = useRouter()
  const route = useRoute()
  const device: any = reactive({ categorys: "" })
  const deviceId = ref("")
  const cxtjbId = ref("")
  const cxtjbName = ref("")
  const zyzdsId = ref("")
  const zyzdsName = ref("")
  async function getDevice() {
    // 开发
    const p = {
      id: route.query.id || "1efb7198-1fa4-4be5-b7be-e812fe230572",
    }
    const res: any = await request.post("machine/selectBaseInfoById", p)
    Object.assign(device, res.list[0])
    const categorysArrT = JSON.parse(device.mould_detail || "[]")
    device.qushu = categorysArrT.length
    if (categorysArrT.length > 0) {
      device.categorys = _.uniq(_.map(categorysArrT, "category_name")).join()
    }
    deviceId.value = res.list[0].id
    cxtjbId.value = res.list[0].cxtjbId
    cxtjbName.value = res.list[0].cxtjbName
    zyzdsId.value = res.list[0].zyzdsId
    zyzdsName.value = res.list[0].zyzdsName
    getStatusList()
    drawHxt("clwcqk")
    const tokenT = sessionStorage.getItem("token") || ""
    getPlan(tokenT)
  }
  const planList = ref([])
  async function getPlan(token: string) {
    planList.value = await request.post("/machine/getPlans", {
      token: token,
      machineToolId: device.name,
      size: 6,
    })
    for (const item of planList.value) {
      if (item.mouldDetails.length > 0) {
        item.categorys = _.uniq(_.map(item.mouldDetails, "categoryName")).join()
        const temp = item.categorys.split(",")
        if (temp.length > 2) {
          console.log(temp)
          item.showCategorys = temp[0] + ",..."
        } else {
          item.showCategorys = item.categorys
        }
      } else {
        item.categorys = ""
        item.showCategorys = ""
      }
      item.color = item.status === 7 ? "#42F58E" : "white"
    }
  }

  const qinwu = ref("")
  const statusListD = ref([])
  async function getStatusList() {
    statusListD.value = []
    const currentH = Number(dayjs().format("H"))
    const date = dayjs().format("YYYY-MM-DD")
    let startTime = ""
    let endTime = ""
    if (currentH > 19) {
      qinwu.value = "E勤"
      startTime = date + " 20:00:00"
      endTime = dayjs().add(1, "d").format("YYYY-MM-DD") + " 08:00:00"
    } else {
      qinwu.value = "D勤"
      startTime = date + " 08:00:00"
      endTime = date + " 20:00:00"
    }
    const p = {
      machineId: deviceId.value,
      pageIndex: 1,
      pageSize: 100,
      startTime: startTime,
      endTime: endTime,
      type: 2,
    }
    const res: any = await request.post("machine/selectHistoryStatus", p)
    statusListD.value = res.list.reverse()
    statusListD.value[statusListD.value.length - 1].endTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
    if (statusListD.value[0].startTime < startTime) {
      statusListD.value[0].startTime = startTime
    }
  }
  const jdl = reactive({
    xData: [],
    yData: [],
  })
  function drawJdl() {
    jdl.xData = []
    jdl.yData = []
    for (let i = 1; i < 13; i++) {
      const temp = Math.floor(Math.random() * 100)
      jdl.yData.push(temp)
      const tempX = 7 + i + ":00"
      jdl.xData.push(tempX)
    }
  }
  onMounted(() => {
    drawJdl()
    getDevice()
  })
  // 环形图
  function drawHxt(id: string) {
    const option = {
      tooltip: {
        trigger: "item",
      },
      title: {
        text: device.quantity + "件",
        subtext: "生产计划",
        top: "middle",
        left: "center",
        textStyle: {
          color: "white",
          fontSize: 20,
        },
        subtextStyle: {
          color: "white",
          fontSize: 14,
        },
      },
      series: [
        {
          name: "生产计划数量",
          type: "pie",
          radius: ["50%", "70%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "transparent",
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            fontSize: 18,
            color: "white",
          },
          data: [
            {
              value: device.count,
              name: "已完成:" + device.count,
              itemStyle: {
                color: "#45b23d",
              },
            },
            {
              value: device.quantity - device.count,
              name: "未完成:" + (device.quantity - device.count),
              itemStyle: {
                color: "#e10f71",
              },
            },
          ],
        },
      ],
    }
    const myChart = echarts.init(document.getElementById(id))
    myChart.clear()
    myChart.setOption(option)
  }

  const dqd = reactive({
    xData: ["完成", "待处理", "待判定"],
    yData: [231, 120, 50],
  })
  function goAllDevice() {
    router.push("/board/alldevice")
  }
  function goPlan() {
    router.push({
      path: "/machine/nextplans",
      query: {
        machineId: route.query.id,
      },
    })
  }
  function changeStatus() {
    console.log(34)
  }
</script>
<template>
  <BoardMain title="成形设备生产状况详情">
    <template #context>
      <div>
        <div class="title">
          <div class="name" :style="{ borderColor: device.color }"> {{ device.name }}</div>
          <div class="status" @click="changeStatus" :style="{ backgroundColor: device.color }">
            {{ device.statusName }}
          </div>
          <div class="content">
            <div style="width: calc(100% - 200px)">
              <div style="display: flex; flex-wrap: wrap">
                <div class="detail"
                  >取数：<span class="text">{{ device.qushu }} </span>
                </div>
                <div class="detail"
                  >品番： <span class="text">{{ device.categorys }}</span></div
                >
                <div class="detail"
                  >生产机种： <span class="text">{{ device.machine_Name }}</span></div
                >
              </div>
              <div style="margin-top: 20px; display: flex"
                ><FileDailog
                  :machine-id="deviceId"
                  :cxtjb-id="cxtjbId"
                  :cxtjb-name="cxtjbName"
                  fileType="成形条件表"
                  @success="getDevice"
                ></FileDailog
                ><FileDailog
                  style="margin-left: 30px"
                  :machine-id="deviceId"
                  :zyzds-id="zyzdsId"
                  :zyzds-name="zyzdsName"
                  fileType="作业指导书"
                  @success="getDevice"
                ></FileDailog
              ></div>
            </div>
            <div style="width: 200px; text-align: right"
              ><div> 设备担当：{{ device.caozuoName }} </div
              ><div style="margin-top: 10px"
                ><el-button link type="primary" @click="goAllDevice" style="font-weight: bold"
                  >返回设备总览</el-button
                ></div
              ></div
            >
          </div>
        </div>
        <div
          style="
            margin: 10px auto;
            padding: 5px;
            position: relative;
            padding: 42px;
            border: 1px solid #a4d2e6;
          "
        >
          <div>
            <div style="position: absolute; margin-top: -28px; display: flex"
              ><div>设备状态</div><div style="margin-left: 8px">{{ qinwu }}</div></div
            >
            <StatusLine :list="statusListD"></StatusLine>
          </div>
        </div>
        <div style="height: calc(100vh - 283px); display: flex; justify-content: space-between">
          <div style="width: 65%; height: 100%">
            <div style="height: 49.5%"
              ><BoardBox title="设备稼动情况">
                <Line id="jdl" :x-data="jdl.xData" :y-data="jdl.yData"></Line
              ></BoardBox>
            </div>
            <div style="height: 1%"></div>
            <div style="height: 49.5%; display: flex; justify-content: space-between">
              <div style="height: 100%; width: 49.7%"
                ><BoardBox title="计划产量完成情况" style="position: relative">
                  <div style="height: 100%" id="clwcqk"></div> </BoardBox
              ></div>
              <div style="height: 100%; width: 49.7%">
                <BoardBox title="产品在库情况">
                  <BarCommon
                    :config-m="{ seriesLabelFormatter: '' }"
                    id="dqd"
                    :x-data="dqd.xData"
                    :y-data="dqd.yData"
                  ></BarCommon>
                </BoardBox>
              </div>
            </div>
          </div>

          <div style="width: 34.5%; height: 100%">
            <BoardBox title="生产计划排产单" @titleClick="goPlan"
              ><div>
                <el-row style="font-weight: bold; margin-top: 10px">
                  <el-col :span="9">计划下达时间</el-col>
                  <el-col :span="5">机种</el-col>
                  <el-col :span="7">品番</el-col>
                  <el-col :span="3">计划产量</el-col>
                </el-row>
                <el-row
                  style="padding-top: 16px"
                  :style="{ color: item.color }"
                  v-for="item in planList"
                  :key="item.id"
                >
                  <el-col :span="9">{{ item.releaseTime }}</el-col>
                  <el-col :span="5">{{ item.machineName }}</el-col>
                  <el-col :span="7">
                    <el-tooltip :content="item.categorys" effect="light" placement="left">
                      {{ item.showCategorys }}
                    </el-tooltip>
                  </el-col>
                  <el-col :span="3">{{ item.quantity }}</el-col>
                </el-row>
              </div></BoardBox
            >
          </div>
        </div>
      </div>
    </template>
  </BoardMain>
</template>

<style lang="less" scoped>
  .title {
    height: 80px;
    display: flex;
    padding: 5px 0px;
    .name {
      height: 100%;
      width: 80px;
      font-size: 36px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid;
      box-sizing: border-box;
    }
    .status {
      height: 100%;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      width: 130px;
      justify-content: center;
      margin-left: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .content {
      display: flex;
      justify-content: space-between;
      width: calc(100% - 80px - 130px - 10px);
      box-sizing: border-box;
      padding-left: 20px;
      .detail {
        min-width: 180px;
        margin-right: 16px;
        .text {
          font-weight: bold;
        }
      }
    }
  }
</style>
