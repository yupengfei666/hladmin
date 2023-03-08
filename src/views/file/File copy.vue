<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import { Plus } from "@element-plus/icons-vue"
  import type { UploadProps } from "element-plus"
  console.log(4)
  const tableItem = [
    {
      prop: "name",
      label: "名称",
    },
    {
      prop: "uploadTime",
      label: "上传时间",
    },
    {
      prop: "pinfan",
      label: "品番",
    },
    {
      prop: "mianshu",
      label: "面数",
    },
    {
      prop: "status",
      label: "状态",
    },
    // {
    //   prop: "isUse",
    //   label: "是否启用",
    // },
    {
      prop: "updatePerson",
      label: "修改人",
    },
    {
      prop: "reason",
      label: "修改原因",
    },
    {
      prop: "updateTime",
      label: "修改时间",
    },
    {
      prop: "affirmPerson",
      label: "确认人",
      width: 100,
    },
    {
      prop: "affirmTime",
      label: "确认时间",
      width: 170,
    },
    {
      prop: "affirmResult",
      label: "确认结果",
    },

    {
      prop: "approver",
      label: "审核人",
      width: 100,
    },
    {
      prop: "approvalTime",
      label: "审核时间",
    },
    {
      prop: "approveResult",
      label: "审核结果",
    },
  ]
  const queryParams: any = ref([])
  const queryNow = ref(false)
  onMounted(() => {
    queryNow.value = true
    queryParams.value = [
      {
        key: "type",
        value: "",
      },
    ]
  })
  const formHead = reactive({
    name: "",
  })

  //这里是编辑界面的操作逻辑
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    ID: "",
    name: "",
    url: "",
    type: "",
    uploadTime: "",
    pinfan: "",
    mianshu: "",
    status: "",
    isUse: "",
    updatePerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
    approver: "",
    reason: "",
    updateTime: "",
    affirmPerson: "",
    affirmTime: "",
    affirmResult: "",
    approvalTime: "",
    approveResult: "",
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
        uploadTime: "",
        url: "",
        type: "",
        pinfan: "",
        mianshu: "",
        status: "",
        isUse: "",
        updatePerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
        approver: "",
        reason: "",
        updateTime: "",
        affirmPerson: "",
        affirmTime: "",
        affirmResult: "",
        approvalTime: "",
        approveResult: "",
      })
    }
  }
  const formRules = reactive<FormRules>({
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  })
  const formRef = ref<FormInstance>()
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        console.log("新增信息!")
        let url = ""
        if (drawer.title == "新增") {
          url = "/file/addFile"
        } else {
          url = "/file/updateFile"
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
  //上传文件要用
  const imageUrl = ref("")
  const jKurl = ref("")
  const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    //这里是获取到的接口返回来的路径
    console.log("response", response)
    jKurl.value = response.response
    form.url = response.response
  }

  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    // if (rawFile.type !== "image/jpeg") {
    //   ElMessage.error("图片必须为JPG格式")
    //   return false
    // } //else if (rawFile.size / 1024 / 1024 > 2) {
    //   ElMessage.error("Avatar picture size can not exceed 2MB!")
    //   return false
    // }
    return true
  }
  //审核操作
  //这里是审核操作
  const dialogVisible = ref(false)
  const tempList = reactive({
    list: {},
  })
  function shenhe(data: any) {
    dialogVisible.value = true
    tempList.list = data
  }
  function shenHeDialog() {
    request
      .post("/file/auditingFile", {
        id: tempList.list.id,
        approveResult: tempList.list.approvalResult,
        approver: JSON.parse(sessionStorage.getItem("currentUser")).account,
      })
      .then((data) => {
        console.log("审核的结果", data)
        dialogVisible.value = false
        queryNow.value = true
      })
  }

  function changeApproveResult(val) {
    tempList.list.approvalResult = val
  }
  //确认文件操作
  const queRendialogVisible = ref(false)
  function querenwj(data: any) {
    queRendialogVisible.value = true
    tempList.list = data
  }
  function changeAffirmResult(val: any) {
    tempList.list.affirmResult = val
  }
  function quxiaoQueRenDialog() {
    queRendialogVisible.value = false
    tempList.list.affirmResult = ""
  }
  function queRenDialog() {
    request
      .post("/file/affirmFile", {
        id: tempList.list.id,
        affirmResult: tempList.list.affirmResult,
        affirmPerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
      })
      .then((data) => {
        console.log("确认文件的操作", data)
      })
  }
  //启用操作

  function qiyong(data: any) {
    console.log("data", data)
    if (data.isUse) {
      ElMessageBox.confirm("您确认要禁用吗", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          data.isUse = "0"
          console.log("form", data)

          const result = await request.post("/file/updateFile", data)

          ElMessage({
            type: "success",
            message: "禁用成功",
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
    } else {
      ElMessageBox.confirm("您确认要启用吗", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          data.isUse = "1"
          console.log("form", data)

          const result = await request.post("/file/updateFile", data)

          ElMessage({
            type: "success",
            message: "启用成功",
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
  }
  const pdfUrl = ref("")
  //预览操作
  function yulan(data: any) {
    console.log("data", data)
    // window.open("https://www.baidu.com")
    request.post("/file/download", { url: data.url }).then((data) => {
      console.log(11)
      console.log(data)
      console.log("文件下载后", data)
      const url = window.URL.createObjectURL(new Blob(data, { type: "application/pdf" }))
      pdfUrl.value = url
    })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <el-input v-model="formHead.name" placeholder="" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <ExportExcelButton fileName="文档管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <iframe
    :src="pdfUrl"
    type="application/x-google-chrome-pdf"
    frameborder="0"
    width="90%"
    height="100%"
    scrolling="auto"
  ></iframe>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      #default="{ scope }"
      query-api="/file/selectFile"
      :query-params="queryParams"
      :operateWidth="350"
    >
      <el-button type="primary" plain @click="yulan(scope.row)">预览</el-button>
      <el-button type="success" @click="shenhe(scope.row)">审核</el-button>
      <el-button type="primary" @click="querenwj(scope.row)">确认</el-button>
      <el-button type="danger" plain v-if="scope.row.isUse" @click="qiyong(scope.row)"
        >禁用</el-button
      >
      <el-button type="primary" v-else @click="qiyong(scope.row)">启用</el-button>
    </CTable>
  </main>

  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show">
      <el-form ref="formRef" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="名称">
          <el-input v-model="form.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="文件类型">
          <el-input v-model="form.type" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            action="http://192.168.0.200:8000/api/file/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 95px; height: 95px" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="品番">
          <el-input v-model="form.pinfan" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="面数">
          <el-input v-model="form.mianshu" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status" style="width: 250px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="是否启用">
          <el-input v-model="form.isUse" style="width: 250px"></el-input>
        </el-form-item> -->
        <template v-if="drawer.title == '编辑'">
          <el-form-item label="修改原因">
            <el-input v-model="form.reason" style="width: 250px"></el-input>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </aside>
  <!-- 这里是审核的dialog -->
  <el-dialog v-model="dialogVisible" title="审核" width="30%">
    <el-form
      style="margin-left: 50px"
      ref="formRef"
      :model="form"
      label-width="80px"
      :rules="formRules"
    >
      <el-form-item label="审核结果">
        <el-select v-model="form.approveResult" placeholder="请选择" @change="changeApproveResult">
          <el-option label="同意" value="同意" />
          <el-option label="不同意" value="不同意" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="shenHeDialog()">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 这里是确认的dialog -->
  <el-dialog v-model="queRendialogVisible" title="确认" width="30%">
    <el-form
      style="margin-left: 50px"
      ref="formRef"
      :model="form"
      label-width="80px"
      :rules="formRules"
    >
      <el-form-item label="确认结果">
        <el-select v-model="form.affirmResult" placeholder="请选择" @change="changeAffirmResult">
          <el-option label="同意" value="同意" />
          <el-option label="不同意" value="不同意" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="quxiaoQueRenDialog">取消</el-button>
        <el-button type="primary" @click="queRenDialog()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 95px;
    height: 95px;
    text-align: center;
  }
</style>
