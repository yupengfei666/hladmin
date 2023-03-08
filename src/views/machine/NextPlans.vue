<!--
 * @Author: zhangchen
 * @Date: 2022-11-09 09:32:57
 * @LastEditTime: 2022-11-30 14:16:19
-->
<script setup lang="ts">
  import { reactive, onMounted, ref, type Ref } from "vue"
  import { ElMessage, ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import dayjs from "dayjs"
  import MachineSelect from "../common/MachineSelect.vue"
  import { useRoute } from "vue-router"
  import type { FormInstance, FormRules } from "element-plus"

  const route = useRoute()
  const token = sessionStorage.getItem("token") as string
  interface FormHead {
    machineId: string
  }
  interface Plans {
    records: Array<any>
  }
  interface Reason {
    reason: string
  }
  const formHead = reactive<FormHead>({
    machineId: "",
  })
  const ruleFormRef = ref<FormInstance>()
  const machineName = ref("")
  formHead.machineId = (route.query.machineId as string) || ""
  const plans: Plans = reactive({
    records: [],
  })
  const machineStatus = ref<string>("")
  const dialogVisible = ref(false)
  //产量为达标需要填写理由
  const reasonForm: Reason = reactive({
    reason: "",
  })
  //表单校验
  const rules = reactive<FormRules>({
    reason: [{ required: true, message: "请输入产量未达标理由", trigger: "blur" }],
  })
  function selectMachine(val: any) {
    getPlan(val.name)
    machineName.value = val.name
    machineStatus.value = val.flag
    console.log("machineStatus", machineStatus)
  }
  /**
   * @description: 获取生产计划最近6条
   * @param {string} machineToolId
   * @return {void}
   */
  function getPlan(machineToolId: string): void {
    request
      .post("machine/getPlans", { token: token, machineToolId: machineToolId, size: 8 })
      .then((data: any) => {
        // 这里返回的直接是一个数组
        // 接收过来的参数不能直接用要进行处理
        data.forEach((item: any) => {
          console.log(item)
          //添加完成计划时的勤务
          if (item.actualStartTime) {
            item.actualDuty = isDorE(item.actualStartTime)
          }
          //初始化默认实际产量为0
          if (!item.actualQuantity) {
            item.actualQuantity = 0
          }
        })
        console.log("获取的计划数据", data)

        plans.records = data
      })
  }
  /**
   * @description: 用来判断传过来的值是D勤还是E勤
   * @param {*} date
   * @return {string}
   */
  function isDorE(date: string): string {
    //time是传过来的当前时间
    const timeNow = dayjs(date).format("HH:mm:ss")
    const timeArray = timeNow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
    const DStartTime = "08:00:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(DS[2])
    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(DE[2])
    //
    if (timeMiao >= DSmiao && timeMiao <= DEmiao) {
      console.log("现在是D勤时间")
      return "D"
    } else {
      console.log("现在是E勤时间")
      return "E"
    }
  }

  /**
   * @description: 执行计划
   * @param {*} data
   * @return {void}
   */
  function doPlan(data: any): void {
    console.log("data", data)

    ElMessageBox.confirm("您确认执行该计划吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        request
          .post("/machine/doPlan", {
            Date: getDate(),
            qinwu: isDorE(new Date() as any) + "勤",
            planId: data.id,
            machineName: data.machineToolId,
          })
          .then((data: any) => {
            console.log("执行任务的返回值", data)
            getPlan(machineName.value)
          })

        ElMessage({
          type: "success",
          message: "执行成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }

  /**
   * @description: 完成计划
   * @param {*} data
   * @return {void}
   */
  function donePlan(data: any): void {
    console.log("data", data)
    //实际产量达到计划产量
    if (data.actualQuantity >= data.quantity) {
      ElMessageBox.confirm("您确认将该计划转为完成吗", "Warning", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request
            .post("/machine/complatePlan", {
              planId: data.id,
              machineId: data.machineToolId,
            })
            .then((data: any) => {
              console.log("执行任务的返回值", data)
              getPlan(machineName.value)
            })

          ElMessage({
            type: "success",
            message: "计划完成",
          })
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消",
          })
        })
    } else {
      // 实际产量未达到计划产量需要填原因
      dialogVisible.value = true
    }
  }
  /**
   * @description: 八点之前取前一天，八点之后取今天
   * @return {string}
   */
  function getDate(): string {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm:ss")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])

    const DStartTime = "08:00:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(DS[2])

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(DE[2])

    if (timeMiao >= DSmiao) {
      return dayjs().format("YYYY-MM-DD")
    } else {
      return dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
  }

  async function ReasonFormSubmit(formEl: FormInstance | undefined) {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log("submit!")
      } else {
        console.log("error submit!", fields)
      }
    })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号：">
        <MachineSelect
          :is-clear="false"
          :selectMachineId="formHead.machineId"
          :selected-first="true"
          @selected-item="selectMachine"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item>
        <el-tooltip placement="bottom">
          <template #content>
            执行：<br />机床处于运行状态下不可点击执行按钮，且同一机床同一时刻只能执行一个计划<br />
            完成：<br />只有机床处于停机状态下才可点击完成按钮<br />
          </template>
          <div id="tips">?</div>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <el-scrollbar height="800px">
      <el-table :data="plans.records" style="width: 100%; margin-top: 10px">
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="机床号" prop="machineToolId" />
        <el-table-column label="模具管理号" prop="mouldId" />
        <el-table-column label="机种名称" prop="machineName" />
        <el-table-column label="制品番号">
          <template #default="scope">
            <div v-for="item in scope.row.mouldDetails">{{ item.categoryName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="制品品名">
          <template #default="scope">
            <div v-for="item in scope.row.mouldDetails">{{ item.productName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="产量">
          <template #default="scope">
            <div>预计：{{ scope.row.quantity }}</div>
            <div>实际：{{ scope.row.actualQuantity }}</div>
          </template>
        </el-table-column>
        <el-table-column label="开始于" width="240">
          <template #default="scope">
            <div>
              预计：{{ dayjs(scope.row.planDate).format("MM-DD") }}/{{
                scope.row.planDuty
              }}&nbsp;&nbsp;{{ dayjs(scope.row.planDate).format("HH:mm") }}
            </div>

            <div v-if="scope.row.actualStartTime">
              实际：{{ dayjs(scope.row.actualStartTime).format("MM-DD") }}/{{
                scope.row.actualDuty
              }}&nbsp;&nbsp;{{ dayjs(scope.row.planDate).format("HH:mm") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="结束于" width="240">
          <template #default="scope">
            <div>
              预计：{{ dayjs(scope.row.planEndTime).format("MM-DD") }}/{{
                scope.row.planDuty
              }}&nbsp;&nbsp;{{ dayjs(scope.row.planDate).format("HH:mm") }}
            </div>
            <div v-if="scope.row.actualEndTime"
              >实际：{{ dayjs(scope.row.actualEndTime).format("MM-DD") }}/{{
                scope.row.planDuty
              }}&nbsp;&nbsp;{{ dayjs(scope.row.planDate).format("HH:mm") }}</div
            >
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusDesc" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              :disabled="machineStatus == 'auto' || Boolean(scope.row.planOrderName)"
              type="primary"
              @click="doPlan(scope.row)"
              >执行</el-button
            >
            <el-button
              :disabled="machineStatus == 'auto' || scope.row.status !== 7"
              @click="donePlan(scope.row)"
              type="success"
              >完成</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </main>
  <aside>
    <!-- 填未完成计划产量的dialog -->
    <el-dialog v-model="dialogVisible" title="计划完成" width="30%">
      <el-form ref="ruleFormRef" :model="reasonForm" :rules="rules">
        <el-form-item label="产量未达标原因" prop="reason">
          <el-input type="textarea" v-model="reasonForm.reason" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="ReasonFormSubmit(ruleFormRef)"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </aside>
</template>
<style scoped>
  #tips {
    width: 16px;
    height: 16px;
    text-align: center;

    line-height: 16px;
    border-radius: 8px;
    background-color: rgb(64, 158, 255);
    color: #ffff;
    font-size: 13px;
  }
</style>
