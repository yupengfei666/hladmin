<script setup lang="ts">
  import { toRefs, reactive, onMounted, watch, ref } from "vue"
  import { dayjs, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox, ElMessage } from "element-plus"
  import request from "@/common/request"
  const props = defineProps({
    showDV: {
      type: Boolean,
      default: false,
    },
    statusObj: {
      type: Object,
      default: () => {},
    },
  })
  const { showDV, statusObj } = toRefs(props)
  const emit = defineEmits(["update:showDV", "success"])
  function closeDV() {
    emit("update:showDV", false)
  }
  //这里保存已经选择的数据  给更新状态接口用
  const selectMessage = reactive({
    id: "",
    name: "",
    status: "",
    remarks: "",
    historyStatusId: "",
    machineId: "",
    operator: "",
  })
  //给更新基础信息用
  const baseInfo = reactive({
    list: {},
  })
  const statusFilter = reactive({
    list: [],
  })
  watch(showDV, (val) => {
    console.log(33)
    if (val) {
      statusFilter.list = statusList.value.filter((item) => {
        return item.id != statusObj.value.status
      })
      selectMessage.name = statusObj.value.name
      selectMessage.status = statusObj.value.status
      selectMessage.historyStatusId = statusObj.value.historyStatusId
      selectMessage.machineId = statusObj.value.id
      console.log("selectMessage", selectMessage)
      form.oldStatus = selectMessage.status
      form.newStatus = ""
      baseInfo.list = statusObj
    }
  })

  async function QueRenSelectStatus() {
    selectMessage.status = form.newStatus
    selectMessage.remarks = form.remarks
    selectMessage.operator = JSON.parse(sessionStorage.getItem("currentUser")).account

    baseInfo.list.status = form.newStatus
    console.log("baseInfo.list", baseInfo.list)
    await request.post("/machine/insertHistoryStatus", {
      machineId: selectMessage.machineId,
      status: form.newStatus,
      startTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      remarks: form.remarks,
      operator: selectMessage.operator,
    })
    console.log("baseInfo", baseInfo.list)

    await request.post("/machine/updateBaseInfo", {
      id: baseInfo.list.id,
      status: baseInfo.list.status,
    })

    closeDV()
    emit("success")
    ElMessage({
      type: "success",
      message: "修改成功",
    })
  }
  onMounted(() => {
    getStatus()
  })
  const statusList = ref([])
  //从数据库中获取所有状态信息
  async function getStatus() {
    const data = {
      name: "",
      pageIndex: 1,
      pageSize: 100,
    }
    const result: any = await request.post("/machine/selectStatus", data)
    statusList.value = result.list
  }
  //dialog 改变状态表单 表单用
  const form = reactive({
    oldStatus: "",
    newStatus: "",
    remarks: "",
  })

  const formRef = ref<FormInstance>()

  const formRules = reactive<FormRules>({
    newStatus: [{ required: true, message: "请选择状态", trigger: "blur" }],
  })
</script>
<template>
  <el-dialog v-model="showDV" title="状态变更" width="24%" @close="closeDV">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules">
      <el-form-item label="当前状态">
        <el-select
          v-model="form.oldStatus"
          class="m-2"
          style="width: 230px"
          placeholder="无"
          disabled
          ><el-option v-for="item in statusList" :label="item.name" :value="item.id" :key="item.id"
        /></el-select>
      </el-form-item>
      <el-form-item label="变更状态" prop="newStatus">
        <el-select
          v-model="form.newStatus"
          filterable
          class="m-2"
          style="width: 230px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in statusFilter.list"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          v-model="form.remarks"
          placeholder="请输入"
          style="width: 230px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="QueRenSelectStatus">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
