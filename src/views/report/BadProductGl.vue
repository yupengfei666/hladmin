<!--
 * @Author: zhangchen
 * @Date: 2022-12-23 08:20:16
 * @LastEditTime: 2022-12-26 15:20:04
-->
<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import { ElMessage } from "element-plus"
  import request from "@/common/request"
  import dayjs from "dayjs"
  import type { FormInstance, FormRules } from "element-plus"

  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    badTypeId: [
      {
        required: true,
        message: "请选择不良品类型",
        trigger: "change",
      },
    ],
    count: [
      {
        pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
        required: true,
        message: "请输入数量，且为正整数类型",
        trigger: "blur",
      },
    ],
  })
  const user = JSON.parse(sessionStorage.getItem("currentUser") as string)
  const machineList = reactive({
    list: [],
  })
  const planeList = reactive({
    list: [],
  })
  const badDataList = reactive({
    list: [],
  })
  const badTypeList = reactive({
    list: [],
  })
  const dialog = reactive({
    show: false,
    title: "新增",
  })
  const formHead = reactive({
    planOrderName: "",
    // operateTime: dayjs().format("YYYY-MM-DD"),
    machineId: "",
    qinwu: "D勤",
    date: dayjs().format("YYYY-MM-DD"),
  })
  const form = reactive({
    planOrderName: formHead.planOrderName,
    badTypeId: "",
    count: "",
  })
  onMounted(async () => {
    await getPlaneId()
    await getMachineId()
    await getBadTypeList()
    console.log(badDataList.list)
    console.log(user.account)
  })
  /**
   * @description: 获取机床号
   * @return {*}
   */
  function getMachineId(): void {
    request.post("/machine/selectBaseInfo", { pageIndex: 1, pageSize: 9999 }).then((data: any) => {
      console.log("获取机床号", data)
      machineList.list = data.list
      formHead.machineId = data.list[0].id
    })
  }

  /**
   * @description: 获取计划号
   * @return {*}
   */
  function getPlaneId(): void {
    request
      .post("/machineclass/selectPlanOrderName", {
        machineId: formHead.machineId,
        qinwu: formHead.qinwu,
        date: formHead.date,
      })
      .then((data: any) => {
        console.log("获取计划号", data)
        if (data.length === 0) {
          ElMessage({
            message: "请先选择合适的机床号、勤务、与时间",
            type: "warning",
          })
        } else {
          formHead.planOrderName = data[0]
          planeList.list = data
        }
      })
  }
  /**
   * @description: 查询不良品履历
   * @return {*}
   */
  function getBadData(): void {
    if (formHead.planOrderName) {
      request
        .post("/operate/selectBadPHistory", {
          planOrderName: formHead.planOrderName,
          isContainZero: 0,
        })
        .then((data: any) => {
          console.log("查询不良品履历", data)
          badDataList.list = data.list
          ElMessage({
            message: "查询成功",
            type: "success",
          })
        })
    } else {
      ElMessage({
        message: "请先查询计划号",
        type: "warning",
      })
    }
  }
  /**
   * @description: 新增不良品履历
   * @return {*}
   */
  function addBadData(): void {
    console.log("新增不良品履历")

    if (formHead.planOrderName) {
      dialog.show = true
    } else {
      ElMessage({
        message: "请先选择合适的机床号、勤务、与时间",
        type: "warning",
      })
    }
  }
  /**
   * @description: 获取不良品类型
   * @return {*}
   */
  function getBadTypeList(): void {
    request.post("/operate/selectBadPtype", { pageIndex: 1, pageSize: 999 }).then((data: any) => {
      console.log("查询不良品类型", data)
      badTypeList.list = data.list
    })
  }
  /**
   * @description: dialog点击确认按钮
   * @param {*} formEl
   * @return {*}
   */
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        request
          .post("/operate/insertBadPHistory", {
            planOrderName: formHead.planOrderName,
            badTypeId: form.badTypeId,
            count: form.count,
            operator: user.account,
          })
          .then(async (data: any) => {
            console.log("新增不良品履历")
            ElMessage({
              message: "新增成功",
              type: "success",
            })

            await request
              .post("/operate/selectBadPHistory", {
                planOrderName: formHead.planOrderName,
                isContainZero: 0,
              })
              .then((data: any) => {
                console.log("查询不良品履历", data)
                badDataList.list = data.list
              })
            dialog.show = false
          })
      } else {
        console.log("error submit!", fields)
      }
    })
  }
</script>
<template>
  <header>
    <el-form
      style="margin-left: 15px; margin-top: 15px"
      :inline="true"
      :model="formHead"
      class="demo-form-inline"
    >
      <el-form-item label="机床号">
        <el-select
          style="width: 180px"
          @change="getPlaneId"
          filterable
          v-model="formHead.machineId"
          class="m-2"
          placeholder="Select"
        >
          <el-option
            v-for="item in machineList.list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          @change="getPlaneId"
          v-model="formHead.date"
          type="date"
          style="width: 180px"
          placeholder="请选择时间"
          value-format="YYYY-MM-DD"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="勤务">
        <el-select
          style="width: 180px"
          @change="getPlaneId"
          v-model="formHead.qinwu"
          class="m-2"
          placeholder="Select"
        >
          <el-option label="D勤" value="D勤" />
          <el-option label="E勤" value="E勤" />
        </el-select>
      </el-form-item>

      <!-- <el-form-item
        ><el-button @click="getPlaneId" type="primary">查询计划号</el-button>
      </el-form-item> -->
      <!-- 计划号相关 -->

      <el-form-item label="计划号">
        <el-select
          style="width: 300px"
          filterable
          v-model="formHead.planOrderName"
          class="m-2"
          placeholder="请选择"
        >
          <el-option v-for="item in planeList.list" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="查询截止时间">
        <el-date-picker
          v-model="formHead.operateTime"
          type="date"
          placeholder="请选择时间"
          value-format="YYYY-MM-DD"
          :clearable="false"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="getBadData" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="addBadData" type="primary">新增</el-button>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <el-table :data="badDataList.list" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="badTypeName" label="不良品类型" />
      <el-table-column prop="count" label="数量" />
      <el-table-column prop="operatorName" label="操作人" />
      <el-table-column prop="operateTime" label="操作时间" />
    </el-table>
  </main>
  <aside>
    <!-- 新增界面 -->
    <el-dialog width="30%" v-model="dialog.show" :title="dialog.title" direction="rtl">
      <el-form ref="ruleFormRef" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="计划号">
          <el-input
            disabled
            style="width: 270px"
            v-model="formHead.planOrderName"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="不良品类型" prop="badTypeId">
          <el-select style="width: 270px" v-model="form.badTypeId" class="m-2" placeholder="请选择">
            <el-option
              v-for="item in badTypeList.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="不良品数量" prop="count">
          <el-input style="width: 270px" v-model="form.count" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </aside>
</template>
