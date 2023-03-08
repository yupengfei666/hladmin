<script lang="ts" setup>
  import { ref, reactive } from "vue"
  import BoardMain from "../common/BoardMain.vue"
  import { onMounted } from "vue"
  import request from "../../common/request"
  import Line from "@/views/common/echarts/Line.vue"
  import Bar from "@/views/common/echarts/Bar.vue"
  import Pie from "@/views/common/echarts/Pie.vue"
  import BarCommon from "../common/echarts/BarCommon.vue"
  import { getCategorysByMouldDetail } from "@/common/common"
  import BoardBox from "../common/BoardBox.vue"
  import BoardMachineBox from "@/views/common/BoardMachineBox.vue"
  import _ from "lodash-es"
  import dayjs from "dayjs"
  const deviceArr = ref([])

  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    deviceArr.value = res.list
    console.log(22)
    console.log(deviceArr.value)

    const tonsTemp = _.uniq(
      _.map(res.list, (val) => {
        return val.tons * 1
      })
    )
    nhByTons.tonsList = _.sortBy(tonsTemp)
    nhByTons.tonsValue = nhByTons.tonsList[0]

    getDataByTons()
    drawNhByMonthAndTon()
    nhByMachine.machine = deviceArr.value[0].id
    getDataByMachine()
    // 单台设备
    nhDeviceByMonth.current = deviceArr.value[0].id
    drawNhDeviceByMonth()
    getDataSort()
  }
  function getDataByMachine() {
    nhByMachine.xData = []
    nhByMachine.yData = []

    for (let i = 11; i > -1; i--) {
      const temp = Math.floor(Math.random() * 200)
      nhByMachine.yData.push(temp)
      const tempX = dayjs().subtract(i, "M").format("YYYY-MM")
      nhByMachine.xData.push(tempX)
    }
  }
  function getDataByTons() {
    nhByTons.sData = []
    nhByTons.tonsList.forEach((item) => {
      nhByTons.sData.push({
        value: Math.floor(Math.random() * 200),
        name: item + "t",
      })
    })
  }

  function getDataSort() {
    nhSort.xData = []
    nhSort.yData = []
    const nhValue = [158, 135, 120, 50, 45, 43, 42, 20]
    for (let i = 0; i < 8; i++) {
      nhSort.xData.push(deviceArr.value[i].name)
      nhSort.yData.push(nhValue[i])
    }
  }
  type BarItem = {
    name: string
    value: number
    month: string
  }
  interface NhTotal {
    xData: string[]
    yData: BarItem[]
    year: string | number
    total: number
  }
  interface NhTotalCommon {
    xData: string[]
    yData: number[]
    current: string
  }
  const nhTotalByYear = reactive<NhTotal>({
    xData: [],
    yData: [],
    year: dayjs().format("YYYY"),
    total: 235,
  })
  interface ListByYear {
    month: string
    nh: string
    jdl: string
  }
  const listByYear = ref<ListByYear[]>([])
  const nhTotalByMonth = reactive<NhTotalCommon>({
    xData: [],
    yData: [],
    current: "",
  })
  const nhByTons = reactive({
    tonsList: [],
    tonsValue: 0,
    xData: [],
    yData: [],
    sData: [],
    configM: {
      seriesLabelFormatter: "",
      yAxisName: "单位：kw·h",
      yAxisShow: true,
    },
  })
  const nhSort = reactive({
    xData: [],
    yData: [],
    configM: {
      seriesLabelFormatter: "",
      yAxisName: "单位：kw·h",
      yAxisShow: true,
    },
  })
  const nhByMachine = reactive({
    machine: "",
    xData: [],
    yData: [],
    configM: {
      yAxisName: "单位：kw·h",
    },
  })
  onMounted(() => {
    drawNhTotalByYear()
    nhTotalByMonth.current = dayjs().format("YYYY-MM")
    drawNhTotalByMonth()
    getDeviceArr()
  })
  function doMonth(val: number | string) {
    if (val < 10) {
      val = "0" + val
    }
    return val
  }
  function drawNhTotalByYear() {
    nhTotalByYear.xData = []
    nhTotalByYear.yData = []

    let initTotal = 12
    if (nhTotalByYear.year === dayjs().format("YYYY")) {
      initTotal = Number(dayjs().format("M"))
    }
    listByYear.value = []
    for (let i = 1; i < initTotal + 1; i++) {
      const temp = Math.floor(Math.random() * 200)
      const tempX = i + "月"
      nhTotalByYear.yData.push({
        name: tempX,
        value: temp,
        month: nhTotalByYear.year + "-" + doMonth(i),
      })
      nhTotalByYear.xData.push(tempX)

      listByYear.value?.push({
        month: tempX,
        nh: temp + "kw·h",
        jdl: Math.floor(Math.random() * 100) + "%",
      })
    }
  }
  function drawNhTotalByMonth() {
    nhTotalByMonth.xData = []
    nhTotalByMonth.yData = []

    const initTotal = dayjs(nhTotalByMonth.current).daysInMonth()
    for (let i = 1; i < initTotal + 1; i++) {
      const temp = Math.floor(Math.random() * 200)
      nhTotalByMonth.yData.push(temp)
      nhTotalByMonth.xData.push(String(i))
    }
  }
  // 单击柱状图事件
  function handleNhClick(data) {
    console.log(data)
    nhTotalByMonth.current = data.month
    drawNhTotalByMonth()
    getDataByTons()
    drawNhDeviceByMonth()
    drawNhByMonthAndTon()
  }
  interface NhDeviceByMonth {
    xData: string[]
    yData: number[]
    current: string
  }
  const nhDeviceByMonth = reactive<NhDeviceByMonth>({
    xData: [],
    yData: [],
    current: "",
  })
  function drawNhDeviceByMonth() {
    nhDeviceByMonth.xData = []
    nhDeviceByMonth.yData = []
    const initTotal = dayjs(nhTotalByMonth.current).daysInMonth()
    for (let i = 1; i < initTotal + 1; i++) {
      const temp = Math.floor(Math.random() * 200)
      nhDeviceByMonth.yData.push(temp)
      nhDeviceByMonth.xData.push(String(i))
    }
  }
  function drawNhByMonthAndTon() {
    nhByTons.xData = []
    nhByTons.yData = []
    const initTotal = dayjs(nhTotalByMonth.current).daysInMonth()
    for (let i = 1; i < initTotal + 1; i++) {
      const temp = Math.floor(Math.random() * 200)
      nhByTons.yData.push({
        value: temp,
        day: nhTotalByMonth.current + "-" + doMonth(i),
      })
      nhByTons.xData.push(String(i))
    }
}
  
</script>
<template>
  <div id="deviceNh">
    <BoardMain title="成形设备能耗状况总览">
      <template #left> </template>
      <template #context>
        <div style="height: calc(100vh - 70px)">
          <!-- 上 -->
          <div style="height: 66%" class="flex">
            <div style="height: 100%; width: 67%">
              <div style="height: 49.5%">
                <BoardBox title="目标电量">
                  <template #right>
                    <div class="flex items-center">
                      <div class="mr-4">
                        {{ nhTotalByYear.year }} 年目标电量累计
                        <span class="font-bold"> {{ nhTotalByYear.total }} kw·h </span></div
                      >
                      <el-date-picker
                        style="width: 100px"
                        v-model="nhTotalByYear.year"
                        value-format="YYYY"
                        @change="drawNhTotalByYear"
                        type="year"
                        placeholder="Pick a year"
                      />
                    </div>
                  </template>
                  <template #default>
                    <BarCommon
                      @onclick-item="handleNhClick"
                      :config-m="{
                        seriesLabelFormatter: '',
                        yAxisShow: true,
                        yAxisName: '单位：kw·h',
                      }"
                      id="zhdlByYear"
                      :x-data="nhTotalByYear.xData"
                      :y-data="nhTotalByYear.yData"
                    ></BarCommon>
                  </template>
                </BoardBox>
              </div>
              <div style="height: 6px"></div>
              <div style="height: calc(100% - 49.5% - 6px)">
                <BoardBox :title="'日耗电量(' + nhTotalByMonth.current + ')'">
                  <template #right>
                    <div class="flex">
                      <div class="mr-4">
                        最高：
                        <span class="font-bold"> 152 kw·h</span>
                      </div>
                      <div class="mr-4">
                        最低：
                        <span class="font-bold"> 50 kw·h</span>
                      </div>
                      <div>
                        平均：
                        <span class="font-bold"> 82 kw·h</span>
                      </div>
                    </div>
                  </template>
                  <template #default>
                    <Line
                      id="nhByMachineId"
                      :x-data="nhTotalByMonth.xData"
                      :y-data="nhTotalByMonth.yData"
                      :config-m="{
                        seriesLabelFormatter: '',
                        yAxisShow: true,
                        yAxisName: '单位：kw·h',
                      }"
                    ></Line>
                  </template>
                </BoardBox>
              </div>
            </div>
            <div style="width: 6px; height: 100%"></div>
            <!-- 右 -->
            <div style="height: 100%; width: calc(100% - 67% - 6px)">
              <div style="height: 49.5%">
                <BoardBox :title="'吨位统计(' + nhTotalByMonth.current + ')'">
                  <Pie id="nhByTonsId" :s-data="nhByTons.sData"></Pie>
                </BoardBox>
              </div>
              <div style="height: 6px"></div>
              <div id="nhList" style="height: calc(100% - 49.5% - 6px)">
                <BoardBox :title="'年度统计(' + nhTotalByYear.year + ')'">
                  <el-table
                    :cell-style="{
                      backgroundColor: '#2c3b66',
                      color: 'white',
                      height: '20px',
                      padding: '4px 0',
                    }"
                    :header-cell-style="{
                      backgroundColor: '#2c3b66',
                      color: 'white',
                      padding: '4px 0',
                    }"
                    :data="listByYear"
                    style="width: 100%; height: 95%; background-color: #2c3b66"
                    height="calc(100% - 0px)"
                  >
                    <el-table-column prop="month" label="月份" width="100" />
                    <el-table-column prop="nh" label="能耗" />
                    <el-table-column prop="jdl" label="稼动率" />
                  </el-table>
                </BoardBox>
              </div>
            </div>
          </div>
          <div style="height: 6px"> </div>
          <!-- 下 -->
          <div style="height: calc(100% - 66% - 6px)" class="flex">
            <div style="width: 33.2%; height: 100%">
              <BoardBox :title="'单台设备(' + nhTotalByMonth.current + ')'">
                <template #right>
                  <el-select
                    filterable
                    style="width: 80px"
                    v-model="nhDeviceByMonth.current"
                    @change="drawNhDeviceByMonth"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in deviceArr"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </template>
                <template #default>
                  <Line
                    id="nhByDevice"
                    :x-data="nhDeviceByMonth.xData"
                    :y-data="nhDeviceByMonth.yData"
                    :config-m="{
                      seriesLabelFormatter: '',
                      yAxisShow: true,
                      yAxisName: '单位：kw·h',
                    }"
                  ></Line>
                </template>
              </BoardBox>
            </div>
            <div style="width: 6px; height: 100%"> </div>
            <div style="width: 33.2%; height: 100%">
              <BoardBox :title="'吨位统计(' + nhTotalByMonth.current + ')'">
                <template #right>
                  <el-select
                    filterable
                    style="width: 80px"
                    v-model="nhByTons.tonsValue"
                    @change="drawNhByMonthAndTon"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in nhByTons.tonsList"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </template>
                <template #default>
                  <Line
                    id="nhByTonsIdE"
                    :x-data="nhByTons.xData"
                    :y-data="nhByTons.yData"
                    :config-m="{
                      seriesLabelFormatter: '',
                      yAxisShow: true,
                      yAxisName: '单位：kw·h',
                    }"
                  ></Line>
                </template> </BoardBox
            ></div>
            <div style="width: 6px; height: 100%"></div>
            <div
              style="
                width: calc(100% - 12px - 33.2% - 33.2%);
                height: 100%;
                background-color: antiquewhite;
              "
            ></div>
          </div>
        </div>
      </template>
    </BoardMain>
  </div>
</template>

<style lang="less" scoped></style>
