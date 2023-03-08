<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { ElMessage, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import MachineSelect from "../common/MachineSelect.vue"
  import dayjs from "dayjs"
  import { role } from "../../common/common"
  console.log(4)
  const tableItem = [
    {
      prop: "name",
      label: "机床号",
      fixed: true,
    },
    // {
    //   prop: "checkTime",
    //   label: "点检时间",
    //   width: 180,
    // },
    {
      prop: "fctzqr",
      label: "非常停止确认",
    },
    {
      prop: "aqmqr",
      label: "安全门确认",
    },
    {
      prop: "pzdzqr",
      label: "喷嘴对正确认",
    },
    {
      prop: "xpxzpsqr",
      label: "吸盘吸嘴破损确认",
    },
    {
      prop: "xpxzcs",
      label: "吸盘吸嘴擦拭",
    },
    {
      prop: "sbycyqr",
      label: "设备异常音确认",
    },
    {
      prop: "jshmdkqr",
      label: "监视画面打开确认",
    },
    {
      prop: "dcqrjc",
      label: "顶出确认检查",
    },
    {
      prop: "mjxqqj",
      label: "模具型腔清洁",
      width: "100px",
    },
    {
      prop: "sgljqr",
      label: "水管连接确认",
    },
    {
      prop: "sprarone",
      label: "sprar温度确认1",
    },
    {
      prop: "sprartwo",
      label: "sprar温度确认2",
    },
    {
      prop: "sprarthree",
      label: "sprar温度确认3",
    },
    {
      prop: "zbsbyzqrone",
      label: "周边设备运转确认1",
    },
    {
      prop: "zbsbyzqrtwo",
      label: "周边设备运转确认2",
    },
    {
      prop: "zbsbyzqrthree",
      label: "周边设备运转确认3",
    },
    {
      prop: "cxtjqr",
      label: "成型条件确认",
    },
    {
      prop: "wdjlclgz",
      label: "温度记录材料干燥",
    },
    {
      prop: "wdjldm",
      label: "温度记录动模",
    },
    {
      prop: "wdjldingm",
      label: "温度记录定模",
    },

    // {
    //   prop: "djddD",
    //   label: "点检担当D勤",
    // },
    // {
    //   prop: "djdd",
    //   label: "点检担当E勤",
    // },
    // {
    //   prop: "bzqrD",
    //   label: "班长确认D勤",
    // },
    // {
    //   prop: "bzqrE",
    //   label: "班长确认E勤",
    // },
    {
      prop: "operator",
      label: "操作人",
      width: 100,
    },
    {
      prop: "operateTime",
      label: "操作时间",
      width: 180,
    },
    {
      prop: "approverName",
      label: "审批人",
      width: 100,
    },
    {
      prop: "approvalTime",
      label: "审批时间",
      width: 180,
    },
    {
      prop: "approvalResult",
      label: "审批结果",
    },
  ]
  //根据权限来对
  const person = reactive({
    role: "bz1",

    isEdit: true,
  })
  const formRef = ref<FormInstance>()
  const machineAll = reactive({
    list: [],
  })
  const queryNow = ref(false)
  const queryParams = ref([])
  onMounted(async () => {
    await getMachineAll()
    queryNow.value = true
    queryParams.value = [
      {
        key: "machineId",
        value: "",
      },
    ]
    console.log("machineAll.list", machineAll.list)
    //  console.log("当前时间", dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"))
  })
  const user = JSON.parse(sessionStorage.getItem("currentUser") as string)
  const formHead = reactive({
    name: "",
    machineId: "",
  })
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    ID: "",
    name: "",
    machineId: "",

    fctzqr: "",
    aqmqr: "",
    pzdzqr: "",
    xpxzpsqr: "",
    xpxzcs: "",
    sbycyqr: "",
    jshmdkqr: "",
    dcqrjc: "",
    mjxqqj: "",
    sgljqr: "",
    sprarone: "",
    sprartwo: "",
    sprarthree: "",
    zbsbyzqrone: "",
    zbsbyzqrtwo: "",
    zbsbyzqrthree: "",
    cxtjqr: "",
    wdjlclgz: "",
    wdjldm: "",
    wdjldingm: "",
    operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
    djddD: "",
    djdd: "",
    bzqrD: "",
    bzqrE: "",
    reportDate: "",
  })
  //这个字段来判断是展示D勤还是E勤
  const isD = ref(true)
  //这个方法来判断是D勤还是E勤
  function isDorE(time: any) {
    //time是传过来的当前时间
    const timenow = dayjs(time).format("HH:mm:ss")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
    // console.log("传递过来的时间的总秒数", timeMiao)

    const DStartTime = "08:00:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(DS[2])
    //console.log("DS早上八点的总秒数", DSmiao)

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(DE[2])
    // console.log("DS晚上八点的总秒数", DEmiao)
    if (timeMiao >= DSmiao && timeMiao < DEmiao) {
      //   console.log("这就是D勤的时间")
      isD.value = true
    } else {
      //  console.log("这就是E勤的时间")
      isD.value = false
    }
  }
  const submitjudge = ref(true)

  async function openDrawer(data = "") {
    drawer.show = true

    if (data) {
      drawer.title = "编辑"
      submitjudge.value = false
      Object.assign(form, data)
      console.log("form", form)
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        ID: "",
        name: "",
        machineId: "",
        fctzqr: "",
        aqmqr: "",
        pzdzqr: "",
        xpxzpsqr: "",
        xpxzcs: "",
        sbycyqr: "",
        jshmdkqr: "",
        dcqrjc: "",
        mjxqqj: "",
        sgljqr: "",
        sprarone: "",
        sprartwo: "",
        sprarthree: "",
        zbsbyzqrone: "",
        zbsbyzqrtwo: "",
        zbsbyzqrthree: "",
        cxtjqr: "",
        wdjlclgz: "",
        wdjldm: "",
        wdjldingm: "",
        djddD: "",
        djdd: "",
        bzqrD: "",
        bzqrE: "",
        operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
        reportDate: "",
      })
      form.machineId = ""

      console.log("新增的form", form)

      // isDorE(form.checkTime)
    }
  }
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        let url = ""
        if (drawer.title == "新增") {
          console.log("新增信息!")

          url = "/operate/insertCheck"
        } else {
          console.log("编辑!")

          url = "/operate/updateCheck"
        }
        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)
          queryNow.value = true
          drawer.show = false
          if (drawer.title == "新增") {
            ElMessage({
              type: "success",
              message: "新增成功!",
            })
          } else {
            ElMessage({
              type: "success",
              message: "修改成功!",
            })
          }
        })
      }
    })
  }
  const formRules = reactive<FormRules>({
    machineId: [{ required: true, message: "请选择机床", trigger: "blur" }],
    // checkTime: [{ required: true, message: "请选择点检时间", trigger: "blur" }],
    fctzqr: [{ required: true, message: "请选择", trigger: "blur" }],
    aqmqr: [{ required: true, message: "请选择", trigger: "blur" }],
    pzdzqr: [{ required: true, message: "请选择", trigger: "blur" }],
    xpxzpsqr: [{ required: true, message: "请选择", trigger: "blur" }],
    xpxzcs: [{ required: true, message: "请选择", trigger: "blur" }],
    sbycyqr: [{ required: true, message: "请选择", trigger: "blur" }],
    jshmdkqr: [{ required: true, message: "请选择", trigger: "blur" }],
    dcqrjc: [{ required: true, message: "请选择", trigger: "blur" }],
    mjxqqj: [{ required: true, message: "请选择", trigger: "blur" }],
    sgljqr: [{ required: true, message: "请选择", trigger: "blur" }],
    sprarone: [{ required: true, message: "请选择", trigger: "blur" }],
    zbsbyzqrone: [{ required: true, message: "请选择", trigger: "blur" }],
    cxtjqr: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjlclgz: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjldm: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjldingm: [{ required: true, message: "请选择", trigger: "blur" }],
  })
  //审核的弹出框
  function open(data: any) {
    console.log("data", data)
    ElMessageBox.confirm("您确认审批【" + data.name + "】号机床吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        console.log("data.id", data.id)
        const params = {
          id: data.id,
          approver: JSON.parse(sessionStorage.getItem("currentUser")).account,
        }
        request.post("/operate/auditingCheck", params).then((resolve) => {
          console.log("审核完成后的返回值", resolve)
          queryNow.value = true
        })

        ElMessage({
          type: "success",
          message: "完成",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //获取全部机床
  function getMachineAll() {
    request
      .post("/machine/selectBaseInfo", {
        name: "",
        pageSize: 100,
        pageIndex: 1,
      })
      .then((data: any) => {
        console.log("查询所有机床号", data)
        machineAll.list = data.list
      })
  }
  //新增框中下拉框的操作
  async function SelectMachine(data: any) {
    if (data.id && drawer.title == "新增") {
      form.machineId = data.id
      console.log("下拉框的data", data)
      getDateAndQinWu()
      console.log(form)
      await request
        .post("/operate/selectCheck", {
          machineId: form.machineId,
          startTime: form.reportDate,
          pageIndex: 1,
          pageSize: 50000,
        })
        .then((data: any) => {
          console.log("校验的data", data)
          if (data.list.length == 0) {
            submitjudge.value = false
          } else {
            submitjudge.value = true
            ElMessage({
              message: "此时间已有点检",
              type: "error",
            })
          }
        })
    } else {
      return
    }

    // if (drawer.title == "新增") {
    //   submitjudge.value = true
    // }
  }
  //查询操作
  function SelectMachineByMachineId(data: any) {
    console.log("下拉框的data", data)

    formHead.machineId = data.id
  }
  function selectButton() {
    queryParams.value = [
      {
        key: "machineId",
        value: formHead.machineId,
      },
    ]
    queryNow.value = true
    ElMessage({
      message: "查询完成",
      type: "success",
    })
  }
  //删除操作
  function deleteById(data: any) {
    ElMessageBox.confirm("您确认删除此条数据吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request.post("/operate/deleteCheck", { id: data.id }).then((data) => {
          console.log("删除操作执行后", data)
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

  //用来传递reportDate的日期
  function getDateAndQinWu() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm:ss")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])

    const DStartTime = "08:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(timeArray[2])

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(timeArray[2])
    //

    if (timeMiao >= DSmiao) {
      console.log("时间取当天时间")
      console.log(dayjs().format("YYYY-MM-DD"))
      form.reportDate = dayjs().format("YYYY-MM-DD HH:mm:ss")
    } else {
      console.log("时间取昨天")
      form.reportDate = dayjs().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss")
    }
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <!-- <el-input v-model="formHead.name" placeholder="" /> -->
        <MachineSelect
          style="width: 250px"
          :selected-first="false"
          @selected-item="SelectMachineByMachineId"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectButton">搜索</el-button>

        <el-button v-if="!(user.role == role.banzhang)" type="primary" @click="openDrawer()"
          >新增</el-button
        >
        <ExportExcelButton fileName="点检管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      :isEditAndDelete="false"
      query-api="/operate/selectCheck"
      :query-params="queryParams"
      :operateWidth="300"
      deleteApi="/operate/deleteCheck"
      #default="{ scope }"
    >
      <el-button
        type="success"
        @click="open(scope.row)"
        :disabled="scope.row.approver"
        style="margin-right: 10px"
        >审批</el-button
      >
      <el-button type="primary" plain @click="openDrawer(scope.row)" style="margin-right: 10px"
        >编辑</el-button
      >
      <el-button type="danger" plain @click="deleteById(scope.row)" style="margin-right: 10px"
        >删除</el-button
      >
    </CTable>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="150px" :rules="formRules">
          <el-form-item label="机床号" prop="machineId">
            <MachineSelect
              style="width: 250px"
              :selected-first="false"
              @selected-item="SelectMachine"
              :selectMachineId="form.machineId"
              :disabled="drawer.title == '编辑'"
            >
            </MachineSelect>
          </el-form-item>

          <el-form-item label="非常停止确认" prop="fctzqr">
            <el-radio-group v-model="form.fctzqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="安全门确认" prop="aqmqr">
            <el-radio-group v-model="form.aqmqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="喷嘴对正确认" prop="pzdzqr">
            <el-radio-group v-model="form.pzdzqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吸盘吸嘴破碎确认" prop="xpxzpsqr">
            <el-radio-group v-model="form.xpxzpsqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吸盘吸嘴擦拭" prop="xpxzcs">
            <el-radio-group v-model="form.xpxzcs" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="设备异常音确认" prop="sbycyqr">
            <el-radio-group v-model="form.sbycyqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="监视画面打开确认" prop="jshmdkqr">
            <el-radio-group v-model="form.jshmdkqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="顶出确认检查" prop="dcqrjc">
            <el-radio-group v-model="form.dcqrjc" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模具型腔清洁" prop="mjxqqj">
            <el-radio-group v-model="form.mjxqqj" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="水管连接确认" prop="sgljqr">
            <el-radio-group v-model="form.sgljqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <div style="border: 1px dashed rgb(181, 183, 189); width: 85%">
            <el-form-item label="SPRAR温度确认" style="margin-left: -5.8%"> </el-form-item>
            <el-form-item label="第一次" prop="sprarone">
              <el-radio-group v-model="form.sprarone" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="第二次">
              <el-radio-group v-model="form.sprartwo" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="第三次">
              <el-radio-group v-model="form.sprarthree" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </div>
          <div style="border: 1px dashed rgb(181, 183, 189); width: 85%; margin-top: 15px">
            <el-form-item label="周边设备运转确认" style="margin-left: -3.2%"> </el-form-item>
            <el-form-item label="第一次" prop="zbsbyzqrone">
              <el-radio-group v-model="form.zbsbyzqrone" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="第二次">
              <el-radio-group v-model="form.zbsbyzqrtwo" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="第三次">
              <el-radio-group v-model="form.zbsbyzqrthree" class="ml-4">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="成型条件确认" style="margin-top: 15px" prop="cxtjqr">
            <el-radio-group v-model="form.cxtjqr" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <div style="border: 1px dashed rgb(181, 183, 189); width: 85%">
            <el-form-item label="温度记录" style="margin-left: -15.3%"> </el-form-item>
            <el-form-item label="材料干燥" prop="wdjlclgz">
              <el-input
                v-model="form.wdjlclgz"
                placeholder="请输入温度（℃）"
                clearable
                style="width: 250px"
              />
            </el-form-item>
            <el-form-item label="动模" prop="wdjldm">
              <el-input
                v-model="form.wdjldm"
                placeholder="请输入温度（℃）"
                clearable
                style="width: 250px"
              />
            </el-form-item>
            <el-form-item label="定模" prop="wdjldingm">
              <el-input
                v-model="form.wdjldingm"
                placeholder="请输入温度（℃）"
                clearable
                style="width: 250px"
              />
            </el-form-item>
          </div>

          <el-form-item style="margin-top: 10px">
            <el-button type="primary" :disabled="submitjudge" @click="submitForm(formRef)"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
</template>
