<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref, computed } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { ElMessage, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox } from "element-plus"
  import request from "../../common/request"

  const formRef = ref<FormInstance>()
  const tableItem = [
    {
      prop: "name",
      label: "类型",
      fixed: true,
    },
  ]
  const queryParams = ref([])

  const queryNow = ref(false)

  onMounted(async () => {
    queryNow.value = true

    queryParams.value = [
      {
        key: "name",
        value: "",
      },
    ]
  })
  const formHead = reactive({
    name: "",
  })
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    ID: "",
    name: "",
  })

  function openDrawer(data = "") {
    drawer.show = true
    console.log(data)
    if (data) {
      drawer.title = "编辑"

      Object.assign(form, data)
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        ID: "",
        name: "",
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

          url = "/operate/insertBadPtype"
        } else {
          console.log("编辑!")

          url = "/operate/updateBadPtype"
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
  const formRules = reactive<FormRules>({
    name: [{ required: true, message: "请输入不良品类型名称", trigger: "blur" }],
  })

  let dialogVisible = ref(false)
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <ExportExcelButton fileName="不良品类型"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      :isEditAndDelete="false"
      :operateWidth="180"
      #default="{ scope }"
      query-api="/operate/selectBadPtype"
      :query-params="queryParams"
      deleteApi="/operate/deleteBadPtype"
    >
    </CTable>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->

    <el-drawer :title="drawer.title" v-model="drawer.show" :size="500">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="130px" :rules="formRules">
          <el-form-item label="不良品类型名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" style="width: 250px" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">确认</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
</template>
<style scoped></style>
