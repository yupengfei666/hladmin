<script setup lang="ts">
  //  历史状态甘特图模式查询
  import { reactive, ref, onMounted } from "vue"
  import MachineSelect from "../../common/MachineSelect.vue"
  import dayjs from "dayjs"
  import request from "../../../common/request"
  import { useRouter, useRoute } from "vue-router"
  import { ElMessageBox, ElMessage } from "element-plus"
  import ItemDialog from "./ItemDialog.vue"
  import _ from "lodash-es"
  const route = useRoute()
  const router = useRouter()
  const formHead = reactive({
    machineId: "",
    time: dayjs().format("YYYY-MM-DD"),
    reportId: "", // 报工id
    isEdit: "", // 是否能编辑问题记录
  })
  formHead.machineId = String(route.query.machineId)
  formHead.time = String(route.query.day)
  if (route.query.reportId) {
    formHead.reportId = String(route.query.reportId)
    // 搜索问题记录
    getWork()
  }
  if (route.query.isEdit) {
    formHead.isEdit = String(route.query.isEdit)
  }
  let workId = ""
  let crateTime = ""
  // 搜索交班记录
  async function getWork() {
    const res = await request.post("work/selectWorkList", {
      pageSize: 100,
      pageIndex: 1,
      reportId: formHead.reportId,
    })
    // 目前只考虑只有一条问题记录情况
    if (res.total > 0) {
      content.value = res.list[0].content
      workId = res.list[0].id
      crateTime = res.list[0].crateTime
    } else {
      content.value = ""
    }
  }

  function selectMachine(val: any) {
    formHead.machineId = val.id
    queryList()
  }
  const showStatusLine = ref<any>([])

  const secondWidth = 100 / 60 / 60 / 2
  let lineStartTime
  let lineEndTime
  async function queryList() {
    machineByDay()
    lineStartTime = formHead.time + " 08:00:00"
    lineEndTime = dayjs(formHead.time).add(1, "d").format("YYYY-MM-DD") + " 07:59:59"
    const p = {
      machineId: formHead.machineId,
      pageIndex: 1,
      pageSize: 100,
      startTime: lineStartTime,
      endTime: lineEndTime,
      type: 2,
    }
    showStatusLine.value = []
    const res: any = await request.post("machine/selectHistoryStatus", p)
    if (!res.list) {
      return
    }
    const statusListD = res.list.reverse()
    if (statusListD[0].startTime < lineStartTime) {
      // 展示时间
      statusListD[0].showStartTime = lineStartTime
    }
    if (statusListD[statusListD.length - 1].endTime > lineEndTime) {
      statusListD[statusListD.length - 1].showEndTime = lineEndTime
    }
    // 机床状态没有结束时间说明 该状态为最新状态
    if (!statusListD[statusListD.length - 1].endTime) {
      // 查询之前时间且状态没有结束时间
      if (formHead.time < dayjs().format("YYYY-MM-DD")) {
        statusListD[statusListD.length - 1].showEndTime = lineEndTime
      } else {
        // 查询当前时间
        statusListD[statusListD.length - 1].showEndTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
      }
    }
    for (const item of statusListD) {
      const startT = item.showStartTime ? item.showStartTime : item.startTime
      const endT = item.showEndTime ? item.showEndTime : item.endTime
      const tjEndT = item.endTime ? item.endTime : dayjs().format("YYYY-MM-DD HH:mm:ss")
      const totalByHour = ((dayjs(tjEndT).unix() - dayjs(item.startTime).unix()) / 60 / 60).toFixed(
        1
      )

      const left = (dayjs(startT).unix() - dayjs(lineStartTime).unix()) * secondWidth
      const timeTotal = dayjs(endT).unix() - dayjs(startT).unix()
      const width = timeTotal * secondWidth
      const showLineEndT = item.endTime ? item.endTime.substr(-8) : "?"
      const nameTemp = item.operatorName ? item.operatorName : item.operator
      showStatusLine.value.push({
        id: item.id,
        item: item,
        startTime: item.startTime,
        left: left,
        width: width,
        total: totalByHour,
        color: item.colorCode,
        initColor: item.colorCode,
        optator: nameTemp,
        name: `${item.status} - ${totalByHour}h - ${item.remarks}`,
      })
    }
  }
  // 当天时间：8:00 - 第二天8:00
  const timeText = [
    "8:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
    "0:00",
    "2:00",
    "4:00",
    "6:00",
    "8:00",
  ]
  function goBase() {
    router.push({
      path: "/machine/historyStatus",
    })
  }
  const oprateStatus = reactive({
    id: "",
    startTime: "",
  })
  function updateStatus(val: any) {
    // 如果当前状态没有结束时间 即是机床的当前状态不允许更改
    if (!val.item.endTime) {
      ElMessage({
        message: "机床当前状态不允许修改！",
        type: "warning",
      })
      return
    }
    for (const item of showStatusLine.value) {
      // item.color = item.initColor
      // 点击状态条时 把其他状态条 颜色变淡
      item.color = "#f0eded"
    }
    oprateStatus.id = val.id
    oprateStatus.startTime = val.startTime
    val.color = "#2196f3"
    formD.data = val.item
  }
  //删除一套数据的操作
  function deletedata() {
    ElMessageBox.confirm("您确认删除此条状态吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      const p = {
        id: oprateStatus.id,
        startTime: oprateStatus.startTime,
      }
      await request.post("/machine/deleteHistoryStatus", p)
      queryList()
      ElMessage({
        type: "success",
        message: "删除成功",
      })
      oprateStatus.id = ""
    })
  }
  const formD = reactive({
    show: false,
    data: {},
    doType: "insert",
  })
  function openDialog(type) {
    formD.show = true
    formD.doType = type
  }
  const qinwuArr = ref([])

  async function machineByDay() {
    const p = {
      machineId: formHead.machineId,
      date: formHead.time,
    }
    const res = await request.post("machineclass/machineByDay", p)

    const temp = _.sortBy(res.list, ["qinwu"])

    const tempResult = _.values(_.groupBy(temp, "qinwu"))
    qinwuArr.value = []
    for (const itemW of tempResult) {
      const obj = {}
      obj.planList = []
      for (const itemN of itemW) {
        obj.qinwu = itemN.qinwu
        obj.banbie = itemN.banbie
        obj.banZhangName = itemN.banZhangName
        obj.caozuoName = itemN.caozuoName
        obj.jiagongName = itemN.jiagongName
        obj.planList.push({
          count: itemN.count,
          quantity: itemN.quantity,
          machine_Name: itemN.machine_Name,
          mould_detail: itemN.mould_detail,
        })
      }
      qinwuArr.value.push(obj)
    }
    for (const item of qinwuArr.value) {
      item.borderTop = item.qinwu === "D勤" ? "0px solid gray" : "1px solid gray"
      for (const itemPlan of item.planList) {
        const categorysArrT = JSON.parse(itemPlan.mould_detail || "[]")
        if (categorysArrT.length > 0) {
          itemPlan.categorys = _.uniq(_.map(categorysArrT, "category_name")).join()
        }
        // itemPlan.categorys += ",RMR2025-K"
        itemPlan.showCount = itemPlan.count + "/" + itemPlan.quantity
      }
    }
    console.log(123)
    console.log(qinwuArr.value)
  }

  function goCalendar() {
    router.push({
      path: "/board/machinebymonth",
      query: {
        machineId: formHead.machineId,
      },
    })
  }
  // 恢复状态条颜色
  function cancel() {
    for (const item of showStatusLine.value) {
      item.color = item.initColor
    }
  }
  const content = ref("")
  async function handleSubmit() {
    const userStorge = JSON.parse(sessionStorage.getItem("currentUser") as string)

    const p = {
      type: 0,
      content: content.value,
      createPerson: userStorge.account,
      reportId: formHead.reportId,
      machineId: formHead.machineId,
    }
    if (workId) {
      p.id = workId
      p.crateTime = crateTime
      // 修改
      await request.post("work/updateWorkListType", p)
    } else {
      // 新增
      await request.post("work/addWorkList", p)
    }
    ElMessage.success("操作成功")
  }
</script>
<template>
  <div>
    <header class="form-head"
      ><el-form :inline="true" :model="formHead">
        <el-form-item label="机床号">
          <MachineSelect
            :is-clear="false"
            :selectMachineId="formHead.machineId"
            @selected-item="selectMachine"
          >
          </MachineSelect> </el-form-item
        ><el-form-item label="日期">
          <el-date-picker
            v-model="formHead.time"
            type="date"
            placeholder="请选择时间"
            value-format="YYYY-MM-DD"
            :clearable="false"
          /> </el-form-item
        ><el-form-item>
          <el-button type="primary" @click="queryList">搜索</el-button>
          <el-button style="margin-left: 8px" type="primary" @click="goBase">普通模式</el-button>
          <el-button style="margin-left: 8px" type="primary" @click="goCalendar"
            >日历模式</el-button
          >
        </el-form-item>
        <el-form-item v-if="oprateStatus.id">
          <el-button type="success" plain @click="openDialog('insert')">插入</el-button>
          <el-button type="primary" plain @click="openDialog('update')">编辑</el-button>
          <el-button type="danger" plain @click="deletedata" style="margin-left: 10px"
            >删除</el-button
          >
          <el-button plain @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </header>
    <section style="display: flex">
      <section
        style="
          width: 140px;
          border-right: 1px solid gray;
          margin-right: 5px;
          height: calc(100vh - 60px);
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <div
          class="qinwu"
          v-for="item in qinwuArr"
          :key="item.qinwu"
          :style="{ borderTop: item.borderTop }"
        >
          <div style="padding-bottom: 4px"> {{ item.qinwu }}</div>
          <div>
            <span class="title">班别：</span><span class="text">{{ item.banbie }}</span>
          </div>
          <div>
            <span class="title">班长：</span><span class="text">{{ item.banZhangName }}</span>
          </div>
          <div>
            <span class="title">操作担当：</span><span class="text">{{ item.caozuoName }}</span>
          </div>
          <div>
            <span class="title">加工担当：</span><span class="text">{{ item.jiagongName }}</span>
          </div>
          <div
            v-for="itemP in item.planList"
            :key="itemP.machine_Name"
            style="border: 1px solid lightgray; margin-top: 4px; padding: 1px"
          >
            <div>
              <span class="title">机种：</span>
              <span class="text">{{ itemP.machine_Name }}</span>
            </div>
            <div>
              <span class="title">品番：</span>
              <span class="text">{{ itemP.categorys }}</span>
            </div>
            <div>
              <span class="title">数量：</span>
              <span class="text">{{ itemP.showCount }}</span>
            </div>
          </div>
        </div>
      </section>
      <section style="margin-left: 70px; position: relative">
        <div class="tt"
          ><div
            :style="{ left: 100 * index - 10 + 'px' }"
            style="position: absolute; margin-top: 15px"
            v-for="(item, index) in timeText"
            :key="item"
            >{{ item }}</div
          >
        </div>
        <div
          style="display: flex; align-items: center; position: relative"
          v-for="item in showStatusLine"
          :style="{
            marginLeft: item.left + 'px',
          }"
          :key="item.left"
        >
          <div style="position: absolute; width: 60px; left: -60px; text-align: right">{{
            item.optator
          }}</div>
          <div
            class="statusLine"
            @click="updateStatus(item)"
            :style="{
              width: item.width + 'px',
              backgroundColor: item.color,
            }"
          ></div>
          <div>{{ item.name }}</div>
        </div>
        <div class="question mt-16">
          <div style="width: 100px">交接说明：</div>
          <div v-if="formHead.isEdit === '1'" style="display: flex; width: 100%">
            <el-input v-model="content" />
            <el-button type="primary" style="margin-left: 10px" @click="handleSubmit"
              >提交</el-button
            >
          </div>
          <div v-else> {{ content }}</div>
        </div>
      </section>
    </section>
    <aside>
      <ItemDialog
        v-model:show-d-v="formD.show"
        :do-type="formD.doType"
        :pre-item="formD.data"
        @success="queryList"
      ></ItemDialog>
    </aside>
  </div>
</template>
<style lang="less" scoped>
  .question {
    display: flex;
    align-items: center;
    padding: 10px 0px;
    border-top: 1px solid #f56c6c;
  }
  .statusLine {
    height: 26px;
    cursor: pointer;
  }
  .tt {
    margin-bottom: 25px;
    width: 1200px;
    background-image: linear-gradient(90deg, #409eff 2px, transparent 0);
    background-size: 100px 100px;
    position: absolute;
    height: 10px;
    border-bottom: 1px solid #409eff;
    margin-top: 25px;
    border-right: 1px solid #409eff;
    display: flex;
    position: relative;
  }
  .qinwu {
    margin-top: 25px;
    width: 120px;
    padding: 4px;
    padding-top: 25px;
    .title {
      font-size: 12px;
    }
    .text {
      font-size: 14px;
    }
  }
</style>
