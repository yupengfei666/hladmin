<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import type { FormInstance, FormRules } from "element-plus"
  console.log(4)
  const tableItem = [
    {
      prop: "name",
      label: "机床号",
    },
    {
      prop: "machineType",
      label: "机种",
    },
    {
      prop: "productName",
      label: "品名",
    },
    {
      prop: "endTime",
      label: "结束时间",
    },
    {
      prop: "planProduction",
      label: "计划产量",
    },
    {
      prop: "actualProduction",
      label: "实际产量",
    },
  ]
  const queryNow = ref(false)
  onMounted(() => {
    queryNow.value = true
  })
  const testData = ref([
    {
      id: 1,
      name: "2",
      mouldName: "S2000i-50A",
      machineType: "机种1",
      productName: "品种1",
      startTime: "2022-08-01",
      endTime: "2022-08-01",
      planProduction: "上模",
      actualProduction: 50,
    },
    {
      id: 1,
      name: "1",
      mouldName: "S2000i-50A",
      machineType: "机种2",
      productName: "品种2",
      startTime: "2022-08-01",
      endTime: "2022-08-01",
      planProduction: "上模",
      actualProduction: 50,
    },
    {
      id: 1,
      name: "1",
      mouldName: "S2000i-50A",
      machineType: "机种3",
      productName: "品种3",
      startTime: "2022-08-01",
      endTime: "2022-08-01",
      planProduction: "上模",
      actualProduction: 50,
    },
    {
      id: 1,
      name: "1",
      mouldName: "S2000i-50A",
      startTime: "2022-08-01",
      machineType: "机种4",
      productName: "品种4",
      endTime: "2022-08-01",
      planProduction: "上模",
      actualProduction: 50,
    },
    {
      id: 1,
      name: "1",
      mouldName: "S2000i-50A",
      startTime: "2022-08-01",
      machineType: "机种5",
      productName: "品种5",
      endTime: "2022-08-01",
      planProduction: "上模",
      actualProduction: 50,
    },
  ])
  const formHead = reactive({
    name: "",
  })
  const form = reactive({
    ID: "",
    name: "",
    mouldName: "",
    startTime: "",
    endTime: "",
    planProduction: 0,
    actualProduction: 0,
  })
  const drawer = reactive({
    show: false,
    title: "",
  })
  function openDrawer(data = "") {
    drawer.show = true
    console.log(data)

    drawer.title = "编辑"
    Object.assign(form, data)
  }
  const formRules = reactive<FormRules>({
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  })
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <el-input style="width: 200px" v-model="formHead.name" placeholder="" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>

        <ExportExcelButton fileName="历史订单"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      :testData="testData"
      @edit-item="openDrawer"
      :isOperate="false"
    ></CTable>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show">
      <el-form ref="formRef" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="机床号" prop="name">
          <el-input v-model="form.name" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item label="模具名称">
          <el-input v-model="form.mouldName" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.startTime"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="Pick a day"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="form.endTime"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="Pick a day"
          />
        </el-form-item>
        <el-form-item label="计划产量">
          <el-input v-model="form.planProduction" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item label="实际产量">
          <el-input v-model="form.actualProduction" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </aside>
</template>
