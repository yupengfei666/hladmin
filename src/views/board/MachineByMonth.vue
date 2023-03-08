<script lang="ts" setup>
  import { ref, reactive, onMounted } from "vue"
  import request from "@/common/request"
  import MachineSelect from "../common/MachineSelect.vue"
  import { getCategorysByMouldDetail } from "@/common/common"
  import dayjs from "dayjs"
  import { useRoute, useRouter } from "vue-router"
  import _ from "lodash-es"
  const router = useRouter()

  const route = useRoute()
  const formHead = reactive({
    machineId: "",
    startTime: dayjs().format("YYYY-MM") + "-01 00:00:00",
  })
  //控制展示范围
  const values = ref(new Date())
  const selectResult = reactive({
    list: {},
  })

  //查询操作
  async function selectData() {
    request
      .post("/tj/machineByMonth", {
        machineId: formHead.machineId,
        startTime: formHead.startTime,
      })
      .then((data: any) => {
        console.log("查询结果", data)
        selectResult.list = data.hashMap

        for (const item of Object.values(selectResult.list)) {
          if (item.isShutdown == true) {
            // isShutdown 计划停机 flag stop 为灰色
            item.backGroundColor = "#767171"
          } else if (item.isShutdown == false && item.output == 0) {
            // 机器不是全天停机 且产品为0 黄色
            item.backGroundColor = "#e07a30"
          } else {
            // 绿色
            item.backGroundColor = "#45b23d"
          }
          // item.plans = JSON.parse(item.plans || "[]")
          if (item.plans) {
            console.log(item.plans.length)
            item.plans[0].showCategorys = getCategorysByMouldDetail(item.plans[0].mould_detail)
            console.log(item)
          }
        }
        values.value = new Date(formHead.startTime)
      })
  }

  function changeData(data) {
    formHead.startTime = data + "-01 00:00:00"
  }
  function goBase() {
    router.push({
      path: "/machine/historyStatus",
    })
  }
  function goGantt(val) {
    console.log(val)
    router.push({
      path: "/machine/historyStatusGantt",
      query: {
        day: val.day,
        machineId: formHead.machineId,
      },
    })
  }

  formHead.machineId = String(route.query.machineId)
  function selectMachine(val) {
    formHead.machineId = val.id
    selectData()
  }
  function openDetail(item) {
    console.log(item)
    for (const val of item) {
      val.allCategory = getCategorysByMouldDetail(val.mould_detail, true)
    }
    dv.list = item
    dv.show = true
  }
  const dv = reactive({
    show: false,
    list: [],
  })
</script>
<template>
  <el-form inline="true" :model="formHead" label-width="80px" style="margin-top: 15px">
    <el-form-item label="机床号:">
      <MachineSelect
        :is-clear="false"
        :selectMachineId="formHead.machineId"
        @selected-item="selectMachine"
      >
      </MachineSelect>
    </el-form-item>

    <el-form-item label="月份:">
      <el-date-picker
        v-model="formHead.startTime"
        type="month"
        placeholder="请选择月份"
        value-format="YYYY-MM"
        @change="changeData"
        :clearable="false"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectData">查询</el-button>
      <el-button style="margin-left: 8px" type="primary" @click="goBase"
        >普通模式</el-button
      ></el-form-item
    >
  </el-form>
  <el-calendar style="width: 100%" v-model="values">
    <template #header="{ date }">
      <span>{{ date }}</span>
    </template>
    <template #dateCell="{ data }">
      <div
        @click="goGantt(data)"
        style="
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 2px 10px;
          color: white;
          font-size: 14px;
        "
        v-if="selectResult.list[data.day] && Date.parse(data.day) <= Date.parse(new Date())"
        :style="{ backgroundColor: selectResult.list[data.day].backGroundColor }"
        :class="data.isSelected ? 'is-selected' : ''"
      >
        <div style="position: relative">
          <span> {{ data.day.split("-").slice(1).join("-") }}</span>
          <!-- {{ selectResult.list[data.day].plans.length }} -->
          <el-button
            v-if="selectResult.list[data.day].plans && selectResult.list[data.day].plans.length > 1"
            type="primary"
            text
            size="small"
            @click.stop="openDetail(selectResult.list[data.day].plans)"
            style="
              padding: 0px 4px;
              height: 20px;
              position: absolute;
              right: -2px;
              font-weight: bold;
              font-size: 20px;
              color: white;
            "
            >+</el-button
          >
        </div>
        <div v-if="selectResult.list[data.day].plans">
          <div>
            <span>{{ selectResult.list[data.day].plans[0].machine_Name }}</span>
            <span style="float: right">
              {{ selectResult.list[data.day].plans[0].showCategorys }}</span
            >
          </div>
          <span style="display: block; float: left">
            {{ selectResult.list[data.day].plans[0].count }}/{{
              selectResult.list[data.day].plans[0].quantity
            }}</span
          >
        </div>
      </div>
    </template>
  </el-calendar>
  <aside>
    <el-dialog v-model="dv.show" title="计划详情" width="400px">
      <el-card v-for="item in dv.list" style="margin-top: 10px">
        <div>
          <span class="dv-text">机种：</span>
          <span>{{ item.machine_Name }}</span>
        </div>
        <div>
          <span class="dv-text">品番：</span>
          <span>{{ item.allCategory }}</span>
        </div>
        <div>
          <span class="dv-text">计划数量：</span>
          <span>{{ item.quantity }}</span>
        </div>
        <div>
          <span class="dv-text">生产数量：</span>
          <span>{{ item.count }}</span>
        </div>
      </el-card>
    </el-dialog>
  </aside>
</template>

<style lang="less" scoped>
  .dv-text {
    width: 80px;
    display: inline-block;
    margin-bottom: 4px;
  }
</style>
