<script setup lang="ts">
  import { reactive, onMounted, ref, computed, watch } from "vue"
  import { dayjs, ElMessage, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox } from "element-plus"
  import request from "@/common/request"
  import { role } from "../../common/common"
  import _ from "lodash-es"
  import ReportLine from "@/views/common/ReportLine.vue"
  import { getCategorysByMouldDetail } from "@/common/common"
  import BadProduct from "@/views/report/BadProduct.vue"
  onMounted(async () => {
    await getDateAndQinWu()
  })

  const user = JSON.parse(sessionStorage.getItem("currentUser") as string)

  const formHead = reactive({
    qinwu: "",
    date: "",
  })

  /**
   * @description: 用来获取需要传递的日期与勤务
   * @return {*}
   */
  function getDateAndQinWu() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60

    const DStartTime = "08:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60

    if (timeMiao >= DSmiao && timeMiao <= DEmiao) {
      formHead.qinwu = "D勤"
    } else {
      formHead.qinwu = "E勤"
    }

    if (timeMiao >= DSmiao) {
      formHead.date = dayjs().format("YYYY-MM-DD")
    } else {
      formHead.date = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
    getList()
  }
  const tableData = ref([])
  const noSubmitMachine = ref("")
  async function getNoSubmitList() {
    const p = {
      classes: user.class,
      distinguish: formHead.qinwu,
      reportDate: formHead.date,
      operator: "",
      pageSize: 1000,
      pageIndex: 1,
    }
    const res = await request.post("operate/selectReport", p)
    const noSubmit = _.filter(res.list, { approveStatus: 0 })
    noSubmitMachine.value = _.map(noSubmit, "name").join()
  }
  async function getList() {
    getNoSubmitList()
    const p = {
      banzhang: user.account,
      reportDate: formHead.date,
      qinwu: formHead.qinwu,
      pageIndex: 1,
      pageSize: 100,
    }
    const res = await request.post("operate/selectReportApprove", p)
    const temp: any = _.values(_.groupBy(res.list, "machineId"))

    for (const itemW of temp) {
      itemW.plansList = []
      for (const itemN of itemW) {
        itemW.machineName = itemN.machineName
        itemW.submitPersonName = itemN.submitPersonName
        itemW.status = itemN.approveTime ? "已审核" : "未审核"
        itemW.listHistoryStatus = itemN.listHistoryStatus
        itemN.machineName = itemN.showCategorys = getCategorysByMouldDetail(itemN.mouldDetail)
        itemW.plansList.push(itemN)
      }
    }
    tableData.value = temp
    console.log(2)
    console.log(tableData.value)
  }
  const badListByType = reactive({
    show: false,
    badTypeId: "",
    badTypeName: "",
    planOrderName: "",
  })
  function getBadList(val, planOrderName) {
    badListByType.planOrderName = planOrderName
    badListByType.badTypeId = val.badTypeId
    badListByType.badTypeName = val.badTypeName
    badListByType.show = true
  }
  const selectedList = ref([])
  function handleSelect(val) {
    selectedList.value = val
  }
  async function handleSubmit() {
    console.log(selectedList.value)
    let submitData: any = []
    for (const item of selectedList.value) {
      submitData = submitData.concat(item.plansList)
    }
    const p = {
      reportApproves: JSON.stringify({ list: submitData }),
    }
    await request.post("operate/approveSubmitted", p)
    ElMessage({
      type: "success",
      message: "审核成功",
    })
    await getList()
  }
</script>

<template>
  <div style="height: 30px; margin-left: 16px">
    <el-form :inline="true" model="" style="margin-top: 20px">
      <el-form-item label="日期：">
        <el-date-picker
          v-model="formHead.date"
          type="date"
          style="width: 180px"
          placeholder="Pick a day"
          value-format="YYYY-MM-DD"
          :clearable="false"
        />
      </el-form-item>

      <el-form-item label="勤务：">
        <el-select style="width: 180px" v-model="formHead.qinwu" class="m-2" placeholder="Select">
          <el-option label="D勤" value="D勤" />
          <el-option label="E勤" value="E勤" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getList" type="primary">查询</el-button>
        <el-button :disabled="selectedList.length === 0" @click="handleSubmit" type="primary"
          >审核</el-button
        >
      </el-form-item>
    </el-form>
  </div>
  <main>
    <div style="display: flex; margin-top: 16px; margin-left: 8px; color: #f5222d"
      ><div>未提交设备：</div><div>{{ noSubmitMachine }}</div></div
    >
    <el-table :data="tableData" @select="handleSelect" style="width: 100%; margin-top: 15px" border>
      <el-table-column type="selection" width="40" />
      <el-table-column fixed prop="machineName" label="机床号" :width="70" />
      <el-table-column prop="showCategorys" label="品番" :width="110">
        <template #default="scope">
          <div v-for="item in scope.row.plansList" :key="item.planOrderName">
            {{ item.showCategorys }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="生产数量" :width="80">
        <template #default="scope">
          <div v-for="item in scope.row.plansList" :key="item.planOrderName">
            {{ item.count }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="badCount" label="不良品总数" :width="80">
        <template #default="scope">
          <div v-for="item in scope.row.plansList" :key="item.planOrderName">
            {{ item.badCount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="不良品详情" :width="465">
        <template #default="scope">
          <div
            v-for="itemPlan in scope.row.plansList"
            :key="itemPlan.planOrderName"
            style="width: 100%; height: 28px"
          >
            <el-scrollbar>
              <div style="display: flex">
                <div
                  v-for="item in itemPlan.badProductHistory"
                  :key="item.badTypeId"
                  style="
                    border: 1px solid green;
                    padding: 0px 4px;
                    margin-right: 4px;
                    width: 113px;
                    margin-bottom: 4px;
                    flex-shrink: 0;
                  "
                >
                  {{ item.badTypeName }} :
                  <span
                    @click="getBadList(item, itemPlan.planOrderName)"
                    style="font-weight: 800; color: #409eff; cursor: pointer"
                  >
                    {{ item.count }}</span
                  >
                </div>
              </div>
            </el-scrollbar>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="submitPersonName" label="提交人" :width="70"> </el-table-column>
      <!-- <el-table-column prop="jiaDong" label="稼动率" /> -->
      <el-table-column label="设备状态图" :width="630">
        <template #default="scope">
          <ReportLine
            :list="scope.row.listHistoryStatus"
            :query-date="formHead.date"
            :qinwu="formHead.qinwu"
          ></ReportLine>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="审核状态"> </el-table-column>
    </el-table>
  </main>
  <aside>
    <BadProduct
      v-model:show-d-v="badListByType.show"
      :bad-type-id="badListByType.badTypeId"
      :bad-type-name="badListByType.badTypeName"
      :plan-order-name="badListByType.planOrderName"
    ></BadProduct
  ></aside>
</template>
<style scoped></style>
