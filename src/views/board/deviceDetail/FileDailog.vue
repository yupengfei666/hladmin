<script setup lang="ts">
  import { reactive, ref, toRefs, watch, onMounted } from "vue"
  import request from "../../../common/request"
  import CTable from "@/views/common/CTable.vue"
  import { ElMessage, ElMessageBox } from "element-plus"
  import { getPinFan, getMianShu } from "@/common/common"
  const props = defineProps({
    machineId: {
      type: String,
      default: "",
    },
    cxtjbId: {
      type: String,
      default: "",
    },
    cxtjbName: {
      type: String,
      default: "",
    },
    zyzdsId: {
      type: String,
      default: "",
    },
    zyzdsName: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "",
    },
  })
  const { machineId, cxtjbId, cxtjbName, zyzdsId, zyzdsName, fileType } = toRefs(props)
  const emit = defineEmits(["success"])
  const fileDialog = reactive({
    show: false,
    title: "",
  })
  watch(cxtjbId, (val) => {
    if (val) {
      getFileById(val)
      formHead.type = 1
    }
  })
  watch(zyzdsId, (val) => {
    if (val) {
      getFileById(val)
      formHead.type = 2
    }
  })
  const fileUrl = ref("")
  async function getFileById(id) {
    const p = {
      pageIndex: 1,
      pageSize: 10,
      id: id,
    }
    const res = await request.post("file/selectFile", p)
    console.log(res)
    fileUrl.value = res.list[0].url
    console.log(fileUrl.value)
  }
  const tableItem = [
    {
      prop: "name",
      label: "名称",
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
      prop: "current",
      label: "当前选择",
    },
  ]
  const queryNow = ref(false)
  const queryParams = ref([])
  const formHead = reactive({
    type: 1,
    pinfan: "",
    mianshu: "",
  })
  function openFileDV(type: number) {
    fileDialog.show = true
    fileDialog.title = type === 1 ? "成形条件表选择" : "作业指导书选择"
    formHead.type = type
    queryList()
  }
  function fileList(data) {
    console.log(data)
    for (const item of data) {
      item.current = item.id === cxtjbId.value || zyzdsId.value ? "是" : ""
    }
  }
  //预览操作
  function yulan(url: string) {
    const urlTemp = url ? url : fileUrl.value
    request.get("/file/download", { url: urlTemp }, true).then((data: any) => {
      const blog = new Blob([data], { type: "application/pdf" })
      const url = URL.createObjectURL(blog)
      window.open(url)
    })
  }
  async function selectedFile(id: string) {
    const p = {
      id: machineId.value,
      fileId: id,
      type: formHead.type,
    }
    await request.post("machine/updateFileId", p)
    ElMessage({
      message: id ? "选择成功" : "清除成功",
      type: "success",
    })
    fileDialog.show = false
    emit("success")
  }
  function clearFile() {
    const messageT = `确认清空该${fileType.value}吗`
    ElMessageBox.confirm(messageT, "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        selectedFile("")
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  const pinFanAndMianShu = reactive({
    pinfan: [],
    mianshu: [],
  })
  onMounted(async () => {
    pinFanAndMianShu.pinfan = await getPinFan()
    pinFanAndMianShu.mianshu = await getMianShu()
  })
  function queryList() {
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
        value: "是",
      },
    ]
    queryNow.value = true
  }
</script>
<template>
  <div id="machineFile">
    <div class="head">
      <div v-if="!cxtjbId && !zyzdsId">
        <el-button type="primary" text @click="openFileDV(formHead.type)"
          >选择{{ fileType }}</el-button
        ></div
      >
      <div v-else>
        <span>{{ fileType }}：</span>
        <span style="font-weight: bold; color: #409eff; cursor: pointer" @click="yulan('')">
          {{ cxtjbName || zyzdsName }}
        </span>
        <el-button style="margin-left: 4px" type="primary" text @click="openFileDV(formHead.type)"
          >选择</el-button
        ><el-button style="margin-left: 4px" type="primary" text @click="clearFile">清除</el-button>
      </div>
    </div>
    <el-dialog v-model="fileDialog.show" :title="fileDialog.title" width="60%">
      <header class="form-head">
        <el-form :inline="true" :model="formHead">
          <el-form-item label="品番">
            <el-select
              v-model="formHead.pinfan"
              class="m-2"
              clearable
              filterable
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option v-for="item in pinFanAndMianShu.pinfan" :lable="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="面数" v-if="cxtjbId">
            <el-select
              clearable
              filterable
              v-model="formHead.mianshu"
              class="m-2"
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option v-for="item in pinFanAndMianShu.mianshu" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryList">搜索</el-button>
          </el-form-item>
        </el-form>
      </header>
      <CTable
        :tableItem="tableItem"
        v-model:queryNow="queryNow"
        query-api="/file/selectFile"
        :query-params="queryParams"
        @do-data="fileList"
        #default="{ scope }"
      >
        <el-button type="success" @click="yulan(scope.row.url)">预览</el-button>
        <el-button type="primary" @click="selectedFile(scope.row.id)">选择</el-button>
      </CTable>
    </el-dialog>
  </div>
</template>
<style>
  #machineFile {
    .head {
      .el-button {
        padding: 5px 4px;
      }
    }
  }
</style>
