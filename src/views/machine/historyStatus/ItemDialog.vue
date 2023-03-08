<script setup lang="ts">
  import { toRefs, reactive, onMounted, watch, ref } from "vue"
  import type { FormInstance, FormRules } from "element-plus"
  import request from "../../../common/request"
  import { ElMessage } from "element-plus"
  const props = defineProps({
    showDV: {
      type: Boolean,
      default: false,
    },
    preItem: {
      type: Object,
      default: () => {},
    },
    doType: {
      type: String,
      default: "insert",
    },
  })
  const { showDV, preItem, doType } = toRefs(props)
  const emit = defineEmits(["update:showDV", "success"])
  function closeDV() {
    emit("update:showDV", false)
  }
  const dv = reactive({
    title: "",
  })
  watch(showDV, (val) => {
    if (val) {
      Object.assign(form, {
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
      if (doType.value === "insert") {
        dv.title = "插入"
        getAllStatus.list = []
        for (const item of initAllStatus) {
          if (item.id !== preItem.value.statusId) {
            getAllStatus.list.push(item)
          }
        }
        form.startTime = preItem.value.startTime
      } else {
        form.status = preItem.value.statusId
        form.remarks = preItem.value.remarks
        form.operator = preItem.value.operator
        form.handleRole = preItem.value.handleRole
        form.handlePerson = preItem.value.handlePerson
        getAllStatus.list = initAllStatus
        dv.title = "编辑"
        if (form.handleRole) {
          changeRole()
        } else {
          form.handlePersonList = form.operatorList
        }
      }
    }
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
    operatorList: [],
    lastId: "",
    endTime: "",
    roleList: [],
    handlePersonList: [],
    handleRole: "",
    handlePerson: "",
  })
  const search = reactive({
    operator: "",
  })
  const formRules = reactive<FormRules>({
    name: [{ required: true, message: "请输入机床名", trigger: "blur" }],
    status: [{ required: true, message: "请输入状态", trigger: "blur" }],
    remarks: [{ required: true, message: "请输入备注", trigger: "blur" }],
    startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
    operator: [{ required: true, message: "请选择操作人", trigger: "blur" }],
  })
  //获取全部状态信息
  const getAllStatus = reactive({
    list: [],
  })
  let initAllStatus = []
  function getStatusAll() {
    request
      .post("/machine/selectStatus", {
        name: "",
        pageSize: 100,
        pageIndex: 1,
      })
      .then((data: any) => {
        initAllStatus = data.list
        getAllStatus.list = data.list
      })
  }
  onMounted(async () => {
    getStatusAll()
    getPerson()
    getRole()
  })
  async function getPerson() {
    const res = await request.post("machine/selectPerson", {
      token: sessionStorage.getItem("token"),
      name: search.operator,
      size: 20,
    })
    form.operatorList = res.list
  }
  async function getRole() {
    const res = await request.post("RiJia/selectRoleList", {
      token: sessionStorage.getItem("token"),
    })
    form.roleList = res
  }
  async function updateItem() {
    form.id = preItem.value.id
    const p = {
      status: form.status,
      id: form.id,
      remarks: form.remarks,
      operator: form.operator,
      handleRole: form.handleRole,
      handlePerson: form.handlePerson,
    }
    await request.post("/machine/updateHistoryStatus", p)
  }
  async function insertItem() {
    form.lastId = preItem.value.id
    form.machineId = preItem.value.machineId
    form.endTime = preItem.value.endTime
    //调用新增历史状态的接口
    if (form.startTime < preItem.value.startTime || form.startTime > preItem.value.endTime) {
      ElMessage({
        message: "插入的开始时间,应该在被插入记录的开始时间和结束时间中间",
        type: "error",
      })
      return false
    } else {
      await request.post("/machine/insertHistoryStatusByUser", form)
      return true
    }
  }
  const formRef = ref()
  //dialog点击确认之后的操作
  function dialogOk() {
    formRef.value.validate(async (valid) => {
      if (valid) {
        if (doType.value === "insert") {
          const result = await insertItem()
          console.log(result)
          if (!result) {
            return
          }
        } else {
          await updateItem()
        }
        closeDV()
        emit("success")
        ElMessage({
          type: "success",
          message: "操作成功!",
        })
      }
    })
  }
  async function changeRole() {
    const res = await request.post("machine/selectPerson", {
      token: sessionStorage.getItem("token"),
      roleName: form.handleRole,
      size: 20,
    })
    form.handlePersonList = res.list
  }
  function searchPerson(val) {
    search.operator = val
    getPerson()
  }
</script>
<template>
  <el-dialog v-model="showDV" :title="dv.title" width="30%" @close="closeDV">
    <div style="margin-left: 80px">
      <el-form ref="formRef" :model="form" label-width="100px" :rules="formRules">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择状态"
            style="width: 250px; margin-left: 0px"
          >
            <el-option v-for="item in getAllStatus.list" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="doType === 'insert'" label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 250px"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select
            v-model="form.operator"
            placeholder="请选择操作人"
            style="width: 250px; margin-left: 0px"
            filterable
            remote
            :remote-method="searchPerson"
          >
            <el-option
              v-for="item in form.operatorList"
              :label="item.name"
              :value="item.account"
              :key="item.account"
            />
          </el-select>
        </el-form-item>
        <div style="padding: 10px; border: 1px solid lightgray; margin: 10px">
          <div style="margin-bottom: 8px"> 待处理担当 </div>
          <el-form-item label="角色">
            <el-select
              v-model="form.handleRole"
              @change="changeRole"
              placeholder="请选择"
              style="width: 200px"
            >
              <el-option
                v-for="item in form.roleList"
                :label="item.roleName"
                :value="item.roleName"
                :key="item.roleName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="担当">
            <el-select
              v-model="form.handlePerson"
              placeholder="请选择"
              style="width: 200px"
              filterable
            >
              <el-option
                v-for="item in form.handlePersonList"
                :label="item.name"
                :value="item.account"
                :key="item.account"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="备注">
          <el-input
            type="textarea"
            :rows="2"
            v-model="form.remarks"
            style="width: 250px; margin-left: 0px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogOk()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
