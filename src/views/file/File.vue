<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"

  import { Delete } from "@element-plus/icons-vue"

  import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus"
  import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import { getPinFan, getMianShu } from "@/common/common"

  console.log(4)

  const tableItem = [
    {
      prop: "name",
      label: "名称",
      width: 150,
    },
    // {
    //   prop: "uploadTime",
    //   label: "上传时间",
    // },
    {
      prop: "pinfan",
      label: "品番",
    },
    {
      prop: "mianshu",
      label: "面数",
    },
    // {
    //   prop: "status",
    //   label: "状态",
    // },

    // {
    //   prop: "isUse",
    //   label: "是否启用",
    // },
    {
      prop: "updatePerson",
      label: "修改人",
      width: 100,
    },
    {
      prop: "reason",
      label: "修改原因",
      width: 170,
    },
    {
      prop: "updateTime",
      label: "操作时间",
      width: 170,
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
      prop: "approveTime",
      label: "审核时间",
      width: 170,
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
    getPinFanAndMianShu()
  })
  const formHead = reactive({
    type: "",
    pinfan: "",
    mianshu: "",
    isFileUpload: "",
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
      fileListYemian.list.length = 0
      Object.assign(form, {
        ID: "",
        name: "",
        uploadTime: "",
        url: "",
        type: "1",
        pinfan: "",
        mianshu: "",
        status: "",
        isUse: "1",
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
    form.name = fileListYemian.list[0].name
    console.log("response", response)
    jKurl.value = response.response
    form.url = response.response
  }

  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
    if (rawFile.type !== "application/pdf") {
      ElMessage.error("必须为PDF格式")

      fileListYemian.list = []
      return false
    } //else if (rawFile.size / 1024 / 1024 > 2) {
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
    // tempList.list.affirmResult = val
    form.affirmResult = val
  }
  function quxiaoQueRenDialog() {
    queRendialogVisible.value = false
    //tempList.list.affirmResult = ""
  }
  async function queRenDialog() {
    await request
      .post("/file/affirmFile", {
        id: tempList.list.id,
        affirmResult: form.affirmResult,
        affirmPerson: JSON.parse(sessionStorage.getItem("currentUser")).account,
      })
      .then((data) => {
        console.log("确认文件的操作", data)
        queRendialogVisible.value = false
        queryNow.value = true
        ElMessage({
          message: "操作成功",
          type: "success",
        })
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
  //预览操作
  function yulan(data: any) {
    request.get("/file/download", { url: data.url }, true).then((data: any) => {
      const blog = new Blob([data], { type: "application/pdf" })
      console.log(blog)

      const url = URL.createObjectURL(blog)
      window.open(url)
      console.log("url", url)
      console.log(111)
      console.log(data)
    })
  }

  const fileList = reactive([])
  const fileListYemian = reactive({
    list: [],
  })
  const upload = ref<UploadInstance>()

  function handleUploadChange(file, fileList) {
    if (fileList.length > 0) {
      fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的文件
      console.log("fileList", fileList)
      fileListYemian.list = fileList
      console.log("fileListYemian", fileListYemian)
    }
  }
  //选择状态
  const temp: any = []
  function changeStatus(val: any) {
    console.log("val", val)
    console.log("temp", temp)
    // temp.length = 0
    ElMessageBox.confirm("您确认修改状态吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        //之后调用增加历史状态的接口
        await request.post("/file/updateFile", val).then((data) => {
          console.log("修改状态的信息", data)
        })
        temp.length = 0
        // console.log("data", data)
        //确认修改状态后进行更新数据

        queryNow.value = true
        ElMessage({
          type: "success",
          message: "修改成功",
        })
      })
      .catch((e) => {
        //  val.status = val.status
        temp.length = 0
        queryNow.value = true
        ElMessage({
          type: "info",
          message: "取消修改",
        })
      })
  }

  function focusStatus(status: any) {
    temp.push(status)
  }
  //取消上传
  function deleteUpload() {
    ElMessageBox.confirm("您确认取消上传此文件吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        form.name = ""
        fileListYemian.list.length = 0
        ElMessage({
          type: "success",
          message: "操作成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消操作",
        })
      })
  }
  const pinFanAndMianShu = reactive({
    pinfan: [],
    mianshu: [],
  })
  //获取品番与面数
  async function getPinFanAndMianShu() {
    pinFanAndMianShu.pinfan = await getPinFan()
    pinFanAndMianShu.mianshu = await getMianShu()
  }
  //按照品番或者面数进行查询
  function searchByPinFanOrMianShu() {
    queryParams.value = [
      {
        key: "type",
        value: formHead.type,
      },
      {
        key: "pinfan",
        value: formHead.pinfan,
      },
      {
        key: "mianshu",
        value: formHead.mianshu,
      },
      {
        key: "isFileUpload",
        value: formHead.isFileUpload,
      },
    ]
    queryNow.value = true
    ElMessage({
      message: "查询成功",
      type: "success",
    })
  }
  //用来控制是否按照面数进行查询
  const isMianShuSelect = ref(true)
  //按照类型进行查询

  function changeType(value) {
    console.log("value", value)
    if (value == "1") {
      isMianShuSelect.value = true
    } else if (value == "2") {
      isMianShuSelect.value = false
    }
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="类型">
        <el-select
          v-model="formHead.type"
          @change="changeType"
          class="m-2"
          clearable
          placeholder="请选择"
          style="width: 250px"
        >
          <el-option label="成形条件表" value="1" />
          <el-option label="作业指导书" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="品番">
        <el-select
          v-model="formHead.pinfan"
          class="m-2"
          clearable
          placeholder="请选择"
          style="width: 250px"
        >
          <el-option v-for="item in pinFanAndMianShu.pinfan" :lable="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="面数" v-if="isMianShuSelect">
        <el-select
          clearable
          v-model="formHead.mianshu"
          class="m-2"
          placeholder="请选择"
          style="width: 250px"
        >
          <el-option v-for="item in pinFanAndMianShu.mianshu" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上传文件">
        <el-select
          clearable
          v-model="formHead.isFileUpload"
          class="m-2"
          placeholder="请选择"
          style="width: 250px"
        >
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByPinFanOrMianShu">搜索</el-button>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <!-- <ExportExcelButton fileName="文档管理"></ExportExcelButton> -->
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      #default="{ scope }"
      query-api="/file/selectFile"
      :query-params="queryParams"
      :operateWidth="380"
    >
      <el-button type="primary" plain @click="yulan(scope.row)" :disabled="!scope.row.url"
        >预览</el-button
      >
      <el-button type="success" :disabled="Boolean(scope.row.approver)" @click="shenhe(scope.row)"
        >审核</el-button
      >
      <el-button
        type="primary"
        :disabled="Boolean(scope.row.affirmPerson)"
        @click="querenwj(scope.row)"
        >确认</el-button
      >

      <el-button type="primary" plain @click="openDrawer(scope.row)">编辑</el-button>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="文件类型">
          <!-- <el-input v-model="form.type" style="width: 250px"></el-input> -->
          <el-select v-model="form.type" class="m-2" placeholder="请选择" style="width: 250px">
            <el-option label="成型条件表" value="1" />
            <el-option label="作业指导书" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="上传文件">
          <!-- <el-upload
            class="avatar-uploader"
            action="http://192.168.0.200:8000/api/file/upload"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 95px; height: 95px" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload> -->
          <!-- 1111111111 -->
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://47.114.81.237:7456/api/file/upload"
            :show-file-list="false"
            :file-list="fileList"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="true"
            :on-change="handleUploadChange"
          >
            <template #trigger>
              <el-button type="primary">上传文件</el-button>
            </template>

            <template #tip>
              <div v-if="fileListYemian.list.length > 0" class="el-upload__tip text-red">
                {{ fileListYemian.list[0].name
                }}<el-button
                  type="danger"
                  style="width: 50px; margin-bottom: 2px"
                  :icon="Delete"
                  link
                  @click="deleteUpload()"
              /></div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="品番">
          <!-- <el-input v-model="form.pinfan" style="width: 250px"></el-input> -->
          <el-select v-model="form.pinfan" class="m-2" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in pinFanAndMianShu.pinfan" :lable="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="面数" v-if="form.type == '1'">
          <!-- <el-input v-model="form.mianshu" style="width: 250px"></el-input> -->
          <el-select v-model="form.mianshu" class="m-2" placeholder="请选择" style="width: 250px">
            <el-option v-for="item in pinFanAndMianShu.mianshu" :lable="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-input v-model="form.status" style="width: 250px"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="是否启用">
          <el-input v-model="form.isUse" style="width: 250px"></el-input>
        </el-form-item> -->

        <el-form-item label="修改原因">
          <el-input type="textarea" :rows="2" v-model="form.reason" style="width: 250px"></el-input>
        </el-form-item>

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
