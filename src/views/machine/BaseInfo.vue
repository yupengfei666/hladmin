<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import { ElMessageBox, ElMessage } from "element-plus"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import MachineSelect from "../common/MachineSelect.vue"
  import statusChangeDialog from "../common/StatusChangeDialog.vue"
  import request from "@/common/request"

  const tableItem = [
    {
      prop: "name",
      label: "机床号",
    },

    {
      prop: "machine_Name",
      label: "机种名",
    },
    {
      prop: "pinFan",
      label: "品番名称",
    },

    {
      prop: "statusName",
      label: "状态",
    },
  ]

  const queryNow = ref(false)
  const queryParams = ref([])

  onMounted(async () => {
    console.log(2352)
    queryParams.value = [
      {
        key: "id",
        value: "",
      },
      {
        key: "isScrap",
        value: "否",
      },
    ]
    queryNow.value = true
  })

  const formHead = reactive({
    name: "",
    id: "",
  })

  //查询功能
  function SelectMachineByMachineId(data: any) {
    formHead.id = data.id
  }
  function selectbyid() {
    console.log("formHead.id", formHead.id)

    queryParams.value = [
      {
        key: "id",
        value: formHead.id,
      },
      {
        key: "isScrap",
        value: "否",
      },
    ]

    ElMessage({
      type: "success",
      message: "查询成功",
    })
    queryNow.value = true
  }

  const statusDV = reactive({
    show: false,
    statusObj: {},
  })
  function changeStatusButton(data: any) {
    statusDV.show = true
    statusDV.statusObj = data
  }
  /**
   * @description: 对数据进行处理
   * @param {*} data
   * @return {*}
   */
  function fileList(data: any): void {
    data.forEach((item: any, index: number) => {
      if (item.mould_detail) {
        const mould_detail = JSON.parse(item.mould_detail)
        let temp: Array<string> = []
        // 进行品番号的数组去重
        mould_detail.forEach((item: any) => {
          temp.push(item.product_name)
        })
        temp = [...new Set(temp)]
        item.pinFan = temp.join(",")
      }
    })
    console.log("data", data)
  }

  const btn1 = ref("")
  onMounted(() => {
    // btn1.value = document.getElementById("btn1")
    const btn2 = document.getElementById("btn2")
    // btn1.onclick = function () {
    //   alert("btn1被点击了！！")
    // }
    // btn2.onclick = function () {
    //   btn1.focus()
    // }
  })
  function button1() {
    alert("btn1被点击了！！")
  }
  function button2() {
    console.log(btn1.value.ref.focus())
  }
  const tt = ref(1)

  async function changeBoxQr(val) {
    console.log(val)
    const message = {
      type: "set-qr-code",
      "qr-code": val.id + "," + val.name,
    }
    const p = {
      topic: "set/" + val.name.substring(0, val.name.length - 1),
      message: JSON.stringify(message),
    }
    await request.post("sendMessage", p)
  }
</script>

<template>
  <!-- <el-button :ref="'btn' + tt" @click="button1" type="primary">按钮1</el-button>
  <el-button id="btn2" @click="button2()" type="primary">按钮2</el-button> -->
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <MachineSelect
          style="width: 250px"
          :selected-first="false"
          @selected-item="SelectMachineByMachineId"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item>
        <el-button ref="ss" type="primary" @click="selectbyid">搜索</el-button>
        <ExportExcelButton fileName="基础信息"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <!-- 展示界面封装为一个vue -->
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      :is-edit-and-delete="false"
      query-api="/machine/selectBaseInfo"
      deleteApi="/machine/deleteBaseInfo"
      :query-params="queryParams"
      :operateWidth="260"
      @do-data="fileList"
      #default="{ scope }"
    >
      <el-button type="warning" @click="changeStatusButton(scope.row)">更改状态</el-button>
      <el-button type="warning" @click="changeBoxQr(scope.row)">更改盒子二维码</el-button>
    </CTable>
  </main>
  <aside>
    <!-- 改变状态的dialog -->
    <statusChangeDialog
      v-model:show-d-v="statusDV.show"
      :status-obj="statusDV.statusObj"
      @success="selectbyid"
    ></statusChangeDialog>
  </aside>
</template>

<style scoped>
  .main {
    height: 360px;
    width: 100%;
    padding-left: 60px;
    padding-top: 20px;
  }
  .contain {
    font-size: 18px;
    margin-top: 5px;
    display: inline-block;
    width: 450px;
    height: 50px;
    margin-left: 8px;
    line-height: 50px;
  }

  .contain label {
    display: inline-block;
    width: 160px;
    border: 1px solid rebeccapurpl;
    text-align: left;
    font-weight: 800;
    color: darkgray;
  }
</style>
