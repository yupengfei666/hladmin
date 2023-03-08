<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { getAllPerson } from "../../common/common"
  import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import CTable from "../common/CTable.vue"
  import dayjs from "dayjs"

  const queryNow = ref(false)

  const tableItem = [
    {
      prop: "checkTime",
      label: "点检时间",
      width: 170,
    },
    {
      prop: "dg",
      label: "吊钩确认",
    },
    {
      prop: "aqm",
      label: "安全帽确认",
    },
    {
      prop: "czhOne",
      label: "操作盒确认1",
    },
    {
      prop: "czhTwo",
      label: "操作盒确认2",
    },
    {
      prop: "dcgss",
      label: "吊车钢丝绳确认",
    },
    {
      prop: "xchxc",
      label: "小车滑线槽确认",
    },
    {
      prop: "dgsxdz",
      label: "吊钩上下动作确认",
    },
    {
      prop: "xcnbdz",
      label: "小车南北动作确认",
    },
    {
      prop: "dcdxdz",
      label: "大车东西动作确认",
    },
    {
      prop: "ycy",
      label: "异常音确认",
    },
    {
      prop: "dwydd",
      label: "吊物用吊带、钢丝绳确认",
    },
    {
      prop: "dgddxwq",
      label: "吊钩顶端限位器确认",
    },
    {
      prop: "dcdbxwq",
      label: "大车端部限位器确认",
    },
    {
      prop: "xcdbxwq",
      label: "小车端部限位器确认",
    },

    {
      prop: "operator",
      label: "操作人",
    },
    {
      prop: "operateTime",
      label: "操作时间",
      width: 180,
    },
    {
      prop: "approver",
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
    {
      prop: "ycjl",
      label: "异常记录",
    },
    {
      prop: "cldc",
      label: "处理对策",
    },
    {
      prop: "cljg",
      label: "处理结果",
    },
    {
      prop: "ycqrPerson",
      label: "异常记录确认人",
    },
  ]
  const queryParams = ref([])
  const PersonList = reactive({
    list: [],
  })

  onMounted(async () => {
    queryNow.value = true

    PersonList.list = await getAllPerson()
  })

  //新增的模块
  const formRef = ref<FormInstance>()
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    ID: "",
    dg: "",
    aqm: "",
    czhOne: "",
    czhTwo: "",
    dcgss: "",
    xchxc: "",
    dgsxdz: "",
    xcnbdz: "",
    dcdxdz: "",
    ycy: "",
    dwydd: "",
    dgddxwq: "",
    dcdbxwq: "",
    xcdbxwq: "",
    checkTime: "",
    operateTime: "",
    approver: "",
    approvalTime: "",
    approvalResult: "",
    ycjl: "",
    cldc: "",
    cljg: "",
    ycqrPerson: "",
    operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
  })
  const formRules = reactive<FormRules>({
    checkTime: [{ required: true, message: "请选择点检时间", trigger: "blur" }],
    dg: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    aqm: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    czhOne: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    czhTwo: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dcgss: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    xchxc: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dgsxdz: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    xcnbdz: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dcdxdz: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    ycy: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dwydd: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dgddxwq: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    dcdbxwq: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    xcdbxwq: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    ycjl: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    cldc: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
    cljg: [{ required: true, message: "请进行点检确认", trigger: "blur" }],

    ycqrPerson: [{ required: true, message: "请进行点检确认", trigger: "blur" }],
  })
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        let url = ""
        if (drawer.title == "新增") {
          console.log("新增吊车点检信息!")
          url = "/crane/insertCheck"
        } else {
          console.log("编辑吊车点检!")
          url = "/crane/updateCheck"
        }
        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)
          queryNow.value = true
          drawer.show = false
          ElMessage({
            type: "success",
            message: "操作成功!",
          })
        })
      }
    })
  }
  function openDrawer(data = "") {
    drawer.show = true
    console.log("data", data)
    if (data) {
      drawer.title = "编辑"
      Object.assign(form, data)
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        ID: "",
        dg: "",
        aqm: "",
        czhOne: "",
        czhTwo: "",
        dcgss: "",
        xchxc: "",
        dgsxdz: "",
        xcnbdz: "",
        dcdxdz: "",
        ycy: "",
        dwydd: "",
        dgddxwq: "",
        dcdbxwq: "",
        xcdbxwq: "",
        checkTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
        operateTime: "",
        approver: "",
        approvalTime: "",
        approvalResult: "",
        ycjl: "",
        cldc: "",
        cljg: "",
        ycqrPerson: "",
      })
    }
  }
  //删除操作//删除操作
  function deleteByID(data: any) {
    ElMessageBox.confirm("您要删除此条数据吗", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const result = await request.post("/crane/deleteCheck", {
          id: data.id,
        })

        ElMessage({
          type: "success",
          message: "删除成功",
        })
        //getJiaDongByReportId()
        queryNow.value = true
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //审批操作
  function shenpi(data: any) {
    ElMessageBox.confirm("您要审批此条数据吗", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        const result = await request
          .post("/crane/auditingCheck", {
            id: data.id,
            approver: JSON.parse(sessionStorage.getItem("currentUser")).account,
          })
          .then((data) => {
            console.log("审批操作", data)
          })

        ElMessage({
          type: "success",
          message: "审批成功",
        })
        //getJiaDongByReportId()
        queryNow.value = true
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <ExportExcelButton fileName="智能吊车点检管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <CTable
    :tableItem="tableItem"
    v-model:queryNow="queryNow"
    @edit-item="openDrawer"
    query-api="/crane/selectCheck"
    :query-params="queryParams"
    deleteApi="/crane/deleteCheck"
    :operateWidth="250"
    #default="{ scope }"
  >
    <el-button type="success" :disabled="scope.row.approver" @click="shenpi(scope.row)"
      >审批</el-button
    >
    <el-button type="primary" plain @click="openDrawer(scope.row)">编辑</el-button>
    <el-button type="danger" plain @click="deleteByID(scope.row)">删除</el-button></CTable
  >
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show" :size="550">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="180px" :rules="formRules">
          <el-form-item label="点检时间" prop="checkTime">
            <el-date-picker
              v-model="form.checkTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="Select date and time"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="吊钩确认" prop="dg">
            <el-radio-group v-model="form.dg" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="安全帽确认" prop="aqm">
            <el-radio-group v-model="form.aqm" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="操作盒确认1" prop="czhOne">
            <el-radio-group v-model="form.czhOne" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="操作盒确认2" prop="czhTwo">
            <el-radio-group v-model="form.czhTwo" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吊车钢丝绳确认" prop="dcgss">
            <el-radio-group v-model="form.dcgss" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小车滑线槽确认" prop="xchxc">
            <el-radio-group v-model="form.xchxc" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吊钩上下动作确认" prop="dgsxdz">
            <el-radio-group v-model="form.dgsxdz" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小车南北动作确认" prop="xcnbdz">
            <el-radio-group v-model="form.xcnbdz" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="大车东西动作确认" prop="dcdxdz">
            <el-radio-group v-model="form.dcdxdz" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="异常音确认" prop="ycy">
            <el-radio-group v-model="form.ycy" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吊物用吊带、钢丝绳确认" prop="dwydd">
            <el-radio-group v-model="form.dwydd" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="吊钩顶端限位器确认" prop="dgddxwq">
            <el-radio-group v-model="form.dgddxwq" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="大车端部限位器确认" prop="dcdbxwq">
            <el-radio-group v-model="form.dcdbxwq" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小车端部限位器确认" prop="xcdbxwq">
            <el-radio-group v-model="form.xcdbxwq" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="异常记录" prop="ycjl">
            <el-input v-model="form.ycjl" placeholder="请输入" style="width: 250px" />
          </el-form-item>
          <el-form-item label="处理决策" prop="cldc">
            <el-input v-model="form.cldc" placeholder="请输入" style="width: 250px" />
          </el-form-item>

          <el-form-item label="处理结果" prop="cljg">
            <el-input v-model="form.cljg" placeholder="请输入" style="width: 250px" />
          </el-form-item>
          <el-form-item label="异常记录确认人确认" prop="ycqrPerson">
            <el-select
              filterable
              v-model="form.ycqrPerson"
              class="m-2"
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option
                v-for="item in PersonList.list"
                :key="item.account"
                :label="item.name"
                :value="item.account"
              />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
</template>
<style></style>
