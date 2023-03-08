<script setup lang="ts">
  import CTable from "../../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../../common/ExportExcelButton.vue"
  import { ElMessageBox, ElMessage } from "element-plus"
  import request from "../../../common/request"
  import dayjs from "dayjs"
  import MachineSelect from "../../common/MachineSelect.vue"
  import { useRouter } from "vue-router"
  import ItemDialog from "./ItemDialog.vue"
  const router = useRouter()
  const tableItem = [
    {
      prop: "machineName",
      label: "机床号",
    },
    {
      prop: "status",
      label: "当前状态",
    },
    {
      prop: "startTime",
      label: "开始时间",
    },
    {
      prop: "endTime",
      label: "结束时间",
    },
    {
      prop: "operatorName",
      label: "操作人",
    },
    {
      prop: "operatingTime",
      label: "操作时间",
    },
    {
      prop: "remarks",
      label: "备注",
    },
  ]
  const queryNow = ref(false)
  //查询全部机床基本信息
  const getAllmechine = reactive({
    list: [],
  })
  async function getMechineall() {
    await request
      .post("/machine/selectBaseInfo", {
        name: "",
        pageSize: 1000,
        pageIndex: 1,
      })
      .then((data: any) => {
        getAllmechine.list = data.list
        formHead.machineId = getAllmechine.list[0].id
        formHead.name = getAllmechine.list[0].name
        console.log("getAllmechine", getAllmechine)
      })
  }
  const formHead = reactive({
    name: "",
    machineId: "",
    startTime: dayjs(Date.parse(new Date()) - 7 * 24 * 60 * 60 * 1000).format(
      "YYYY-MM-DD HH:mm:ss"
    ),
    endTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    selectType: "1",
    time: "",
    qinwu: "",
  })

  //查询历史状态的全部信息

  const queryParams = ref([])
  onMounted(async () => {
    await getMechineall()
    console.log("formHead", formHead)
    queryParams.value = [
      {
        key: "type",
        value: "0",
      },
      {
        key: "machineId",
        value: formHead.machineId,
      },
    ]

    queryNow.value = true
  })
  //编辑操作
  const drawer = reactive({
    show: false,
    title: "插入",
  })

  const form = reactive({
    id: "",
    name: "",
    status: "",
    remarks: "",
    machineId: "",
    historyStatusId: "",
    startTime: "",
    operator: "",
    lastId: "",
    endTime: "",
  })

  //查询功能

  function selectbyquery() {
    console.log(656)
    form.machineId = formHead.machineId
    form.name = formHead.name

    if (formHead.selectType == "1") {
      queryParams.value = [
        {
          key: "type",
          value: formHead.selectType,
        },
        {
          key: "machineId",
          value: formHead.machineId,
        },
        {
          key: "startTime",
          value: formHead.startTime,
        },
        {
          key: "endTime",
          value: formHead.endTime,
        },
      ]
      queryNow.value = true
      form.machineId = formHead.machineId
    } else if (formHead.selectType == "2") {
      console.log("form-head", formHead)
      if (formHead.time == "") {
        ElMessage({
          message: "请选择日期",
          type: "error",
        })
      } else if (formHead.qinwu == "") {
        ElMessage({
          message: "请选择勤务",
          type: "error",
        })
      } else {
        queryParams.value = [
          {
            key: "type",
            value: formHead.selectType,
          },
          {
            key: "machineId",
            value: formHead.machineId,
          },
          {
            key: "startTime",
            value: formHead.startTime,
          },
          {
            key: "endTime",
            value: formHead.endTime,
          },
        ]
        queryNow.value = true
      }
    }
  }

  function changeQinwu(val) {
    if (!formHead.time) {
      ElMessage({
        type: "error",
        message: "请先选择日期!",
      })
      formHead.qinwu = ""
      return
    }

    if (val === "D") {
      formHead.startTime = formHead.time + " 08:00:00"
      formHead.endTime = formHead.time + " 20:00:00"
    } else if (val === "E") {
      formHead.startTime = formHead.time + " 20:00:00"
      formHead.endTime = dayjs(formHead.time).add(1, "d").format("YYYY-MM-DD") + " 08:00:00"
    }
  }
  //这里是查询的时候选择机床号 同时给编辑框绑定上机床号  目前用不上
  function selectMachineId(val: any) {
    formHead.machineId = val.id
  }
  //删除一套数据的操作
  function deletedata(data: any) {
    console.log("data", data)

    ElMessageBox.confirm("您确认删除此条数据吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request
          .post("/machine/deleteHistoryStatus", { id: data.id, startTime: data.startTime })
          .then((data) => {
            console.log("删除操作")
            queryNow.value = true
          })
        ElMessage({
          type: "success",
          message: "删除成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }

  const formD = reactive({
    show: false,
    data: {},
    doType: "insert",
  })
  function openDrawer(data: any) {
    formD.show = true
    formD.data = data
    formD.doType = "update"
  }
  function openDialog(data: any) {
    formD.show = true
    formD.data = data
    formD.doType = "insert"
    Object.assign(form, {
      id: "",
      name: "",
      status: "",
      remarks: "",
      historyStatusId: "",
      machineId: formHead.machineId,
      startTime: "",
      operator: "",
      lastId: "",
      endTime: "",
    })
    form.lastId = data.id
    form.machineId = formHead.machineId
    form.endTime = data.endTime

    console.log("插入操作的form", form)
  }

  //按时间进行搜索的开始时间和结束时间的校验
  //控制搜索按钮是否禁用
  const selectButtonDisabled = ref(false)

  function startTime(a: any) {
    if (Date.parse(a) > Date.parse(formHead.endTime)) {
      //buttonable.value = true
      selectButtonDisabled.value = true
      ElMessage({
        type: "error",
        message: "开始时间应小于结束时间",
      })
    } else {
      //  buttonable.value = false
      selectButtonDisabled.value = false
    }
}
  function endTime(a: any) {
    if (Date.parse(a) < Date.parse(formHead.startTime)) {
      // buttonable.value = true
      selectButtonDisabled.value = true
      ElMessage({
        type: "error",
        message: "结束时间应大于开始时间",
      })
    } else {
      //  buttonable.value = false
      selectButtonDisabled.value = false
    }
  }

  function changeChaXunFangShi() {
    if (formHead.selectType == "1") {
      formHead.startTime = dayjs(Date.parse(new Date()) - 7 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      formHead.endTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
    } else {
      formHead.qinwu = ""
      formHead.time = ""
    }
  }
  function goCalendar() {
    router.push({
      path: "/board/machinebymonth",
      query: {
        machineId: formHead.machineId,
      },
    })
}
  function goGantt() {
    // 8点之前看前一天状态数据
    const currentH = dayjs().format("HH")
    let day
    if (currentH > "07") {
      day = dayjs().format("YYYY-MM-DD")
    } else {
      day = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
    router.push({
      path: "/machine/historyStatusGantt",
      query: {
        machineId: formHead.machineId,
        day: day,
      },
    })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <!-- 机床号下拉框 -->
      <el-form-item label="机床号">
        <MachineSelect :is-clear="false" :selected-first="true" @selected-item="selectMachineId">
        </MachineSelect>
      </el-form-item>
      <!-- 选择分类 -->
      <el-form-item label="查询方式">
        <!-- <el-input style="width: 200px" v-model="formHead.name" placeholder="" clearable /> -->
        <el-select
          v-model="formHead.selectType"
          @change="changeChaXunFangShi"
          placeholder="请选择查询方式"
          style="width: 200px"
        >
          <el-option label="按时间" value="1" />
          <el-option label="按勤务" value="2" />
        </el-select>
      </el-form-item>
      <!-- 按时间 -->
      <template v-if="formHead.selectType == '1'">
        <el-form-item label="开始时间" style="margin-left: 15px">
          <el-date-picker
            v-model="formHead.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="startTime"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formHead.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
            :clearable="false"
            @change="endTime"
          />
        </el-form-item>
      </template>
      <template v-if="formHead.selectType == '2'">
        <el-form-item label="日期" style="margin-left: 15px">
          <el-date-picker
            v-model="formHead.time"
            type="date"
            placeholder="请选择时间"
            style="width: 250px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="勤务">
          <el-select
            v-model="formHead.qinwu"
            @change="changeQinwu"
            placeholder="请选择勤务"
            style="width: 200px"
          >
            <el-option label="D勤" value="D" />
            <el-option label="E勤" value="E" />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" :disabled="selectButtonDisabled" @click="selectbyquery"
          >搜索</el-button
        >
        <ExportExcelButton fileName="历史状态"></ExportExcelButton>
        <el-button style="margin-left: 8px" type="primary" @click="goCalendar">日历模式</el-button>
        <el-button style="margin-left: 8px" type="primary" @click="goGantt">甘特图模式</el-button>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      @edit-item="openDrawer"
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      :isOperate="true"
      query-api="/machine/selectHistoryStatus"
      :query-params="queryParams"
      deleteApi="/machine/deleteHistoryStatus"
      :operateWidth="250"
      #default="{ scope }"
    >
      <el-button :disabled="!scope.row.endTime" type="success" @click="openDialog(scope.row)"
        >插入</el-button
      >
      <el-button :disabled="!scope.row.endTime" type="primary" plain @click="openDrawer(scope.row)"
        >编辑</el-button
      >

      <el-button
        :disabled="!scope.row.endTime"
        type="danger"
        @click="deletedata(scope.row)"
        style="margin-left: 10px"
        plain
        >删除</el-button
      >
    </CTable>
  </main>
  <aside>
    <ItemDialog
      v-model:show-d-v="formD.show"
      :do-type="formD.doType"
      :pre-item="formD.data"
      @success="selectbyquery"
    ></ItemDialog>
  </aside>
</template>
<style></style>
