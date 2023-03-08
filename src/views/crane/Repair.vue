<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { ElMessage, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox } from "element-plus"
  import request from "../../common/request"
  console.log(4)
  const tableItem = [
    {
      prop: "bxJg",
      label: "报修机构",
      fixed: true,
    },
    {
      prop: "bxTime",
      label: "报修时间",
      width: 180,
    },

    {
      prop: "bxms",
      label: "故障描述",
    },
    {
      prop: "bxPerson",
      label: "报修人",
    },
    {
      prop: "wxStartTime",
      label: "维修开始时间",
      width: 180,
    },
    {
      prop: "wxEndTime",
      label: "维修结束时间",
      width: 180,
    },
    {
      prop: "wxyy",
      label: "故障原因",
    },
    {
      prop: "wxgc",
      label: "维修过程",
    },
    {
      prop: "wxghyqj",
      label: "更换元器件",
    },
    {
      prop: "wxcz",
      label: "材质",
    },
    {
      prop: "wxcj",
      label: "维修厂家",
    },
    {
      prop: "wxPerson",
      label: "维修人",
    },
    {
      prop: "status",
      label: "状态",
    },
  ]
  const formRef = ref<FormInstance>()

  const queryNow = ref(false)
  const queryParams = ref([])
  onMounted(() => {
    queryNow.value = true
    queryParams.value = [
      // {
      //   key: "name",
      //   value: "",
      // },
    ]
  })

  //用来控制编辑与删除是否显示（如果操作人存在就不显示）
  const ifhasOpeator = ref(true)

  const drawer = reactive({
    show: false,
    title: "新增",
    draweredit: true,
  })
  const form = reactive({
    ID: "",
    bxJg: "",
    bxTime: "",
    bxms: "",
    bxPerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
    wxStartTime: "",
    wxEndTime: "",
    wxyy: "",
    wxgc: "",
    wxghyqj: "",
    wxcz: "",
    wxcj: "",
    wxPerson: "",
    status: JSON.parse(sessionStorage.getItem("currentUser")).account,
  })
  function openDrawer(data = "", editshow: any) {
    drawer.show = true
    console.log("data", data)
    console.log("editshow", editshow)

    if (data) {
      drawer.title = "编辑"
      drawer.draweredit = editshow
      Object.assign(form, data)
      form.wxPerson = JSON.parse(sessionStorage.getItem("currentUser")).account
    } else {
      drawer.title = "新增"
      drawer.draweredit = editshow
      Object.assign(form, {
        ID: "",
        bxJg: "",
        bxTime: "",
        bxms: "",

        wxStartTime: "",
        wxEndTime: "",
        wxyy: "",
        wxgc: "",
        wxghyqj: "",
        wxcz: "",
        wxcj: "",
        wxPerson: "",
        status: "",
        bxPerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
      })
    }
  }

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        let url = ""
        if (drawer.title == "新增") {
          console.log("新增信息!")

          url = "/crane/insertApplyRepair"
        } else {
          console.log("编辑!")

          url = "/crane/updateRepair"
        }
        request.post(url, form).then((data) => {
          if (form.wxPerson) {
          }
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
  const formRules = reactive<FormRules>({
    bxJg: [{ required: true, message: "请输入名称", trigger: "blur" }],
    wxStartTime: [{ required: true, message: "请输入维修开始时间", trigger: "blur" }],
    wxEndTime: [{ required: true, message: "请输入维修结束时间", trigger: "blur" }],
    wxPerson: [{ required: true, message: "请输入维修人", trigger: "blur" }],
  })
  //删除数据操作
  function deleterepaire(data: any) {
    ElMessageBox.confirm("您确认删掉此条数据吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        request.post("/crane/deleteRepair", { id: data.id }).then((data) => {
          console.log("删除之后的返回值", data)
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
    console.log("data", data)
  }

  //维修时间的时间校验
  const buttonable = ref(false)
  function startTime(a: any) {
    console.log("开始时间", a)

    if (Date.parse(a) > Date.parse(form.wxEndTime)) {
      buttonable.value = true
      ElMessage({
        type: "error",
        message: "开始时间应小于结束时间",
      })
    } else {
      buttonable.value = false
    }
  }
  function endTime(a: any) {
    console.log("结束时间", a)
    if (Date.parse(a) < Date.parse(form.wxStartTime)) {
      buttonable.value = true
      ElMessage({
        type: "error",
        message: "结束时间应大于开始时间",
      })
    } else {
      buttonable.value = false
    }
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" @click="openDrawer('', true)">新增报修</el-button>
        <ExportExcelButton fileName="维修管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      :isEditAndDelete="false"
      query-api="/crane/selectRepair"
      :query-params="queryParams"
      :operateWidth="300"
      deleteApi="/crane/deleteRepair"
      #default="{ scope }"
    >
      <el-button type="success" @click="openDrawer(scope.row, false)" style="margin-right: 10px"
        >维修</el-button
      >
      <div v-show="!scope.row.wxPerson" style="display: inline-block">
        <el-button type="primary" plain @click="openDrawer(scope.row, false)">编辑</el-button>
        <el-button type="danger" plain @click="deleterepaire(scope.row)">删除</el-button>
      </div>
    </CTable>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show" :size="500">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="150px" :rules="formRules">
          <template v-if="drawer.draweredit">
            <el-form-item label="报修机构" prop="bxJg">
              <el-input v-model="form.bxJg" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="报修时间">
              <el-date-picker
                v-model="form.bxTime"
                type="datetime"
                placeholder="请选择报修时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 250px"
              />
            </el-form-item>
            <el-form-item label="故障描述">
              <el-input v-model="form.bxms" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="报修人">
              <el-input disabled v-model="form.bxPerson" style="width: 250px"></el-input>
            </el-form-item>
          </template>
          <template v-if="!drawer.draweredit">
            <el-form-item label="维修开始时间" prop="wxStartTime">
              <el-date-picker
                v-model="form.wxStartTime"
                type="datetime"
                placeholder="请选择维修开始时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 250px"
                @change="startTime"
              />
            </el-form-item>
            <el-form-item label="维修结束时间" prop="wxEndTime">
              <el-date-picker
                v-model="form.wxEndTime"
                type="datetime"
                placeholder="请选择维修结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 250px"
                @change="endTime"
              />
            </el-form-item>
            <el-form-item label="故障原因">
              <el-input v-model="form.wxyy" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="维修过程">
              <el-input v-model="form.wxgc" style="width: 250px"></el-input>
            </el-form-item>

            <el-form-item label="更换元器件">
              <el-input v-model="form.wxghyqj" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="材质">
              <el-input v-model="form.wxcz" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="维修厂家">
              <el-input v-model="form.wxcj" style="width: 250px"></el-input>
            </el-form-item>

            <el-form-item label="维修人" prop="wxPerson">
              <el-input disabled v-model="form.wxPerson" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-input v-model="form.status" style="width: 250px"></el-input>
            </el-form-item>
          </template>
          <el-form-item>
            <el-button type="primary" :disabled="buttonable" @click="submitForm(formRef)"
              >确定</el-button
            >
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
</template>
