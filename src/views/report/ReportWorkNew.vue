<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import { ElMessage } from "element-plus"
  import WorkAll from "./WorkAll.vue"
  import request from "@/common/request"
  import { role, getCurrentDayAndQinwu } from "../../common/common"
  import _ from "lodash-es"
  import ReportLine from "@/views/common/ReportLine.vue"
  import BadProduct from "@/views/report/BadProduct.vue"
  import { useRouter } from "vue-router"
  const router = useRouter()

  const user = JSON.parse(sessionStorage.getItem("currentUser") as string)
  const token = sessionStorage.getItem("token")
  const isBangzhang = ref(false) // 是否是班长登录
  const currentOperator = ref("") // 当前操作
  const operatorList = ref([])
  onMounted(async () => {
    getDateAndQinWu()
    // 如果当前用户为班长，则把被分配机床的操作列出 供班长切换选择
    if (user.role === role.banzhang) {
      await getOperator()
      isBangzhang.value = true
    } else {
      selectByDateAndQinWu()
      getBanzhangAccount()
    }
  })
  /**
   * 获取当前日期所有接班的操作担当
   */
  async function getOperator() {
    const res = await request.post("operate/selectDistinctReport", {
      distinguish: formHead.qinwu,
      reportDate: formHead.date,
    })
    operatorList.value = res.list
    if (res.list.length === 0) {
      ElMessage.info("当前时间还未有操作担当接班")
      return
    }
    currentOperator.value = res.list[0].operator
    selectByDateAndQinWu()
    getBanzhangAccount()
  }
  const tableData = ref<any[]>([])
  const formHead = reactive({
    classes: "",
    qinwu: "",
    date: "",
    banzhang: "",
    banzhangaccount: "",
    banbie: "",
    operator: "",
  })

  const approveStatusTextObj = {
    0: {
      text: "未提交",
      color: "#8c8c8c",
    },
    1: {
      text: "已提交",
      color: "#faad14",
    },
    2: {
      text: "已审批",
      color: "#52c41a",
    },
  }

  function doMachineDetail() {
    for (const item of tableData.value) {
      // 制品计划相关
      if (item.listMachineClassDetail.length > 0) {
        for (const detailItem of item.listMachineClassDetail) {
          const temp = JSON.parse(detailItem.mould_detail || "[]")
          detailItem.qushu = temp.length
          detailItem.categorys = _.uniq(_.map(temp, "category_name")).join()
        }
      }

      item.approveStatusText = approveStatusTextObj[item.approveStatus].text
      item.approveStatusColor = approveStatusTextObj[item.approveStatus].color
      // 点检时间 只显示时分
      if (item.checkTime) {
        item.checkTime = item.checkTime.substr(11, 8)
      }
    }
  }

  /**
   * @description: 获取日期与勤务
   * @return {*}
   */
  function getDateAndQinWu() {
    const result = getCurrentDayAndQinwu()
    formHead.qinwu = result.qinwu
    formHead.date = result.date
  }

  const approveData = reactive({
    list: [],
    banZhang: 0,
  })
  //获取当前用户的所在班组的班长
  function getBanzhangAccount() {
    request
      .post("/RiJia/selectCurrentClass", {
        token: token,
        className: user.class,
        current: 1,
        size: 10000,
      })
      .then((data: any) => {
        data.list.forEach((item) => {
          if (item.roleName == role.banzhang) {
            approveData.banZhang = item.account
            formHead.banzhangaccount = item.account
            formHead.banbie = item.className
          }
        })
      })
  }
  //外观品质确认详细的数据界面
  const qualitydialogVisible = ref(false)
  const qualityData = reactive({
    list: [],
  })
  function qualitysure(data: any) {
    console.log("data", data)
    request
      .post("/operate/selectCheckOutside", {
        machineId: data.machineId,
        pageIndex: 1,
        pageSize: 1000,
        reportDate: formHead.date,
        qinwu: formHead.qinwu,
      })
      .then((data: any) => {
        console.log("查询外观品质确认", data)
        qualityData.list = data.list
        qualitydialogVisible.value = true
      })
  }
  const canJiaoban = ref(false)
  const canJieban = ref(false)
  interface WorkListT {
    id: string
    machineName: string
    content: string
    type: string
    reportId: string
    machineId: string
    createTime?: string
    createName?: string
    completePersonName?: string
  }
  const workListCurrent = ref<WorkListT[]>([])
  const workListLast = ref<WorkListT[]>([])
  /**
   * @description:按照日期与勤务与班次对报工进行查询
   * @return {*}
   */
  function selectByDateAndQinWu(): void {
    request
      .post("/operate/selectReport", {
        classes: formHead.classes,
        distinguish: formHead.qinwu,
        reportDate: formHead.date,
        operator: currentOperator.value ? currentOperator.value : user.account,
        pageSize: 1000,
        pageIndex: 1,
      })
      .then((data: any) => {
        if (data) {
          if (data.total === -1) {
            ElMessage.error("请联系班长为您分配机床")
            return
          }

          // 判断交班
          canJiaoban.value = data.list[0].isGoOffWork ? false : true
          const temp = getCurrentDayAndQinwu()
          // 记录为当前勤务 说明已经接班，不可以继续接班
          if (data.list[0].reportDate === temp.date && temp.qinwu === data.list[0].distinguish) {
            canJieban.value = false
          } else {
            // 记录不是本当前时间并且 已经交班 可以接班
            if (data.list[0].isGoOffWork) {
              canJieban.value = true
            }
          }
          workListCurrent.value = []
          for (const item of data.list) {
            // 向本班次交班记录中增加记录
            if (item.listWork.length > 0) {
              workListCurrent.value.push({
                id: item.listWork[0].id,
                machineName: item.listWork[0].machineName,
                createTime: item.listWork[0].crateTime,
                content: item.listWork[0].content,
                type: String(item.listWork[0].type),
                machineId: item.machineId,
                reportId: item.id,
                completePersonName: item.listWork[0].completePersonName,
              })
            }
            // 如果报工记录未提交 班长不可点击
            // item.canSelect =
            //   isBangzhang.value === true && item.approveStatus === 0 ? "" : "selection"
          }
          workListLast.value = []
          let tempStartTime, tempEndTime
          const dateC = getCurrentDayAndQinwu()
          console.log(dateC)

          if (dateC.qinwu === "D勤") {
            tempStartTime = dateC.date + " " + dateC.startTime
            tempEndTime = dateC.date + " " + dateC.endTime
          } else {
            // E勤
            if (dateC.currentDate !== dateC.date) {
              // 0-8 第二天8点前
              tempStartTime = dateC.currentDate + " 00:00:00"
              tempEndTime = dateC.currentDate + " " + dateC.endTime
            } else {
              // 当天
              tempStartTime = dateC.date + " " + dateC.startTime
              tempEndTime = dateC.date + " 23:59:59"
            }
          }
          for (const item of data.listWork) {
            // 判断记录是否为本班次记录 是 移到 workListCurrent 中 如果本班次有该记录则不移
            if (item.crateTime >= tempStartTime && item.crateTime <= tempEndTime) {
              const jilu = _.find(workListCurrent.value, { id: item.id })

              if (!jilu) {
                workListCurrent.value.push({
                  id: item.id,
                  machineName: item.machineName,
                  createTime: item.crateTime,
                  content: item.content,
                  type: String(item.type),
                  reportId: item.reportId,
                  machineId: item.machineId,
                  completePersonName: item.completePersonName,
                  createName: item.createPersonName,
                })
              }
            } else {
              workListLast.value.push({
                id: item.id,
                machineName: item.machineName,
                createTime: item.crateTime,
                createName: item.createPersonName,
                content: item.content,
                type: String(item.type),
                reportId: item.reportId,
                machineId: item.machineId,
                completePersonName: item.completePersonName,
              })
            }
          }

          // workList.value = [...workList.value, ...workList.value, ...workList.value]
          // workList.value = [...workList.value, ...workList.value, ...workList.value]
          // data.list = [...data.list, ...data.list, ...data.list]
          tableData.value = _.sortBy(data.list, "approveStatus")
          doMachineDetail()
        } else {
          ElMessage.error("接口出错啦")
        }
      })
      .catch((err) => {
        alert(err)
      })
  }

  function handleSelect(val) {
    approveData.list = val
  }
  async function handleSubmit() {
    const p = {
      reportDate: formHead.date,
      banzhang: approveData.banZhang,
    }
    let url, message
    if (isBangzhang.value) {
      const temp = []
      approveData.list.forEach((item) => {
        temp.push(item.id)
      })
      p.reportApproves = JSON.stringify({ list: temp })
      url = "operate/approveSubmitted"
      message = "审批成功"
    } else {
      p.reports = JSON.stringify({ list: approveData.list })
      url = "operate/insertReportApprove"
      message = "提交成功"
    }
    await request.post(url, p)
    selectByDateAndQinWu()
    ElMessage.success(message)
  }
  const badTypeData = reactive({
    list: [],
    show: false,
  })
  async function badCountList(val) {
    console.log(val)
    badListByType.planOrderName = val.planOrderName
    const res = await request.post("operate/selectBadPHistoryCount", {
      planOrderName: val.planOrderName,
    })
    badTypeData.list = res.list
    badTypeData.show = true
  }
  const badListByType = reactive({
    show: false,
    badTypeId: "",
    badTypeName: "",
    planOrderName: "",
  })
  function getBadList(val) {
    badListByType.badTypeId = val.badTypeId
    badListByType.badTypeName = val.badTypeName
    badListByType.show = true
  }
  function goStatus(data) {
    router.push({
      path: "/machine/historyStatusGantt",
      query: {
        machineId: data.machineId,
        day: formHead.date,
        reportId: data.id,
        isEdit: canJiaoban.value ? "1" : "0", // 是否能编辑问题记录
      },
    })
  }
  async function handleJiaoban() {
    const userStorge = JSON.parse(sessionStorage.getItem("currentUser"))
    const p = {
      distinguish: formHead.qinwu,
      reportDate: formHead.date,
      operator: userStorge.account,
    }
    await request.post("operate/GoOffWork", p)
    selectByDateAndQinWu()
    ElMessage.success("交班成功")
  }
  async function handleJieban() {
    const reportIdsT = {
      reportIds: [],
    }
    const jsonReportsT = {
      list: [],
    }
    const jsonJiaoBanDanDang = []
    console.log(tableData.value)

    for (const item of tableData.value) {
      reportIdsT.reportIds.push(item.machineId)
      jsonReportsT.list.push({
        machineId: item.machineId,
        affirm: item.affirm,
      })
      jsonJiaoBanDanDang.push({
        machineId: item.machineId,
        operator: item.operator,
      })
    }
    const userStorge = JSON.parse(sessionStorage.getItem("currentUser"))
    const p = {
      reportIds: JSON.stringify(reportIdsT),
      jsonReports: JSON.stringify(jsonReportsT),
      distinguish: formHead.qinwu,
      reportDate: formHead.date,
      operator: userStorge.account,
      banZhang: formHead.banzhangaccount,
      banBie: formHead.banbie,
      jsonJiaoBanDanDang: JSON.stringify({ list: jsonJiaoBanDanDang }),
    }
    await request.post("operate/GoToWork", p)
    selectByDateAndQinWu()
    ElMessage.success("接班成功")
  }
  const jiluShow = ref(false)
  // 当前人为班长 且记录未提交或已审批时不可审批
  function handleSelectList(row, index) {
    return isBangzhang.value && (row.approveStatus === 0 || row.approveStatus === 2) ? false : true
  }
  function handleAllSelected(val) {
    approveData.list = val
  }
</script>

<template>
  <div id="reportPage">
    <div style="height: 30px; margin-left: 16px">
      <el-form :inline="true" model="" style="margin-top: 20px">
        <el-form-item label="日期：">
          <el-date-picker
            v-model="formHead.date"
            type="date"
            style="width: 180px"
            placeholder="Pick a day"
            value-format="YYYY-MM-DD"
            @change="selectByDateAndQinWu"
            :clearable="false"
          />
        </el-form-item>
        <el-form-item label="勤务：">
          <el-select
            @change="selectByDateAndQinWu"
            style="width: 180px"
            v-model="formHead.qinwu"
            placeholder="Select"
          >
            <el-option label="D勤" value="D勤" />
            <el-option label="E勤" value="E勤" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="jiluShow = true" type="primary">交班记录</el-button>
          <el-button v-if="canJiaoban" @click="handleJiaoban" type="primary">交班</el-button>
          <el-button v-if="canJieban" @click="handleJieban" type="primary">接班</el-button>
        </el-form-item>
        <el-form-item v-if="isBangzhang" @change="selectByDateAndQinWu">
          <el-radio-group v-model="currentOperator">
            <el-radio :label="item.operator" v-for="item in operatorList" :key="item.operator">{{
              item.operatorName
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 操作 -->
      <el-button
        style="position: absolute; right: 73px; top: 22px"
        :disabled="approveData.list.length === 0"
        @click="handleSubmit"
        type="primary"
        >{{ isBangzhang ? "审批确认" : "提交审批" }}</el-button
      >
    </div>
    <main>
      <el-table
        border
        :data="tableData"
        style="width: 100%; margin-top: 15px"
        @select="handleSelect"
        @select-all="handleAllSelected"
        height="calc(100vh - 65px)"
      >
        <el-table-column fixed prop="name" label="机床号" :width="55" />

        <el-table-column prop="pinfan" label="品番" :width="110">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.categorys }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="取数" :width="40">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.qushu }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="jiepai" label="节拍" :width="70">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.avgJiepai }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="output" label="良品数量" :width="70">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="output" label="待处理数量" :width="70">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="output" label="待判定数量" :width="70">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="output" label="不良品数量" :width="70">
          <template #default="scope">
            <div v-for="item in scope.row.listMachineClassDetail" :key="item.id">
              {{ item.count }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mjsy" label="模具上油" :width="55"> </el-table-column>
        <el-table-column prop="qualityAffirm" label="外观品质确认" :width="70">
          <template #default="scope">
            <el-button
              :disabled="!(scope.row.qualityAffirm > 0)"
              style="font-weight: 800; color: #409eff"
              text
              @click="qualitysure(scope.row)"
              >{{ scope.row.qualityAffirm }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isBangzhang"
          prop="jiaoBanDanDangName"
          label="交班担当"
          :width="82"
        />
        <el-table-column prop="affirm" label="接班6S确认" :width="73">
          <template #default="scope">
            <el-switch
              v-if="canJieban"
              v-model="scope.row.affirm"
              :active-value="1"
              :inactive-value="0"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
            <span v-else>{{ scope.row.affirm === 0 ? "否" : "是" }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="checkTime" label="点检时间" :width="85" />
        <el-table-column prop="checkPersonName" label="点检担当" :width="90" />

        <el-table-column label="设备状态" :width="530">
          <template #default="scope">
            <ReportLine
              style="cursor: pointer"
              @click="goStatus(scope.row)"
              :list="scope.row.listHistoryStatus"
              :query-date="formHead.date"
              :qinwu="formHead.qinwu"
              :line-width="500"
            ></ReportLine>
          </template>
        </el-table-column>
        <el-table-column v-if="isBangzhang" prop="operatorName" label="提交人" :width="82" />
        <el-table-column prop="approveStatusText" label="审批状态" :width="83">
          <template #default="scope">
            <span :style="{ color: scope.row.approveStatusColor }" style="font-weight: bold">{{
              scope.row.approveStatusText
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :selectable="handleSelectList" type="selection" width="40" />
      </el-table>
    </main>
    <aside>
      <WorkAll
        v-model:show-d-v="jiluShow"
        :current-list="workListCurrent"
        :last-list="workListLast"
        :is-banzhang="isBangzhang"
        @on-success="selectByDateAndQinWu"
      ></WorkAll>
      <!-- 外观品质确认详细界面 -->
      <el-dialog v-model="qualitydialogVisible" title="外观品质确认记录" width="50%">
        <el-table stripe :data="qualityData.list" style="width: 100%">
          <el-table-column type="index" label="序号" :width="70" />
          <el-table-column prop="machineName" label="机床号" />
          <el-table-column prop="accountName" label="点检人" />
          <el-table-column prop="qinwu" label="勤务" />
          <el-table-column prop="createTime" label="点检时间" />
        </el-table>
      </el-dialog>
      <!-- 不良品类型统计界面 -->
      <el-dialog v-model="badTypeData.show" title="不良品类型统计" width="480px">
        <el-table stripe :data="badTypeData.list" style="width: 100%">
          <el-table-column type="index" label="序号" :width="70" />
          <el-table-column prop="badTypeName" label="类型" />
          <el-table-column prop="count" label="总数">
            <template #default="scope">
              <el-button
                :disabled="!(scope.row.count > 0)"
                style="font-weight: 800; color: #409eff"
                text
                @click="getBadList(scope.row)"
                >{{ scope.row.count }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <BadProduct
        v-model:show-d-v="badListByType.show"
        :bad-type-id="badListByType.badTypeId"
        :bad-type-name="badListByType.badTypeName"
        :plan-order-name="badListByType.planOrderName"
      ></BadProduct>
    </aside>
  </div>
</template>
<style lang="less">
  #reportPage {
    .el-radio {
      margin-right: 16px !important;
    }
  }
</style>
