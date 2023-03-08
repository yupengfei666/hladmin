<script setup lang="ts">
  import { toRefs, watch, onMounted, ref } from "vue"
  import request from "@/common/request"
  import { ElMessage, ElMessageBox } from "element-plus"
  import { Delete, Edit } from "@element-plus/icons-vue"
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    current: {
      // 是否是本班次
      type: Boolean,
      default: true,
    },
    isBanzhang: {
      // 是否是班长，班长不允许编辑
      type: Boolean,
      default: false,
    },
  })

  const { list, title, current } = toRefs(props)
  const emit = defineEmits(["onSuccess"])
  const tableData = ref([])
  tableData.value = []

  for (const item of list.value) {
    item.isEdit = false
    tableData.value.push(item)
  }
  watch(list, (val) => {
    tableData.value = []
    for (const item of val) {
      item.isEdit = false
      tableData.value.push(item)
    }
  })
  const user = JSON.parse(sessionStorage.getItem("currentUser") as string)
  async function handleChange(val) {
    const tempCode = val.type === "0" ? "" : user.account
    await request.post("work/updateCompleteStatus", {
      id: val.id,
      completePerson: tempCode,
      type: val.type,
    })
    ElMessage.success("修改成功")
    emit("onSuccess")
  }
  //删除操作
  function handleDelete(id: string) {
    ElMessageBox.confirm("您确认删除此条记录吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      await request.post("work/deleteWorkList", { id: id })
      ElMessage.success("删除成功")
      emit("onSuccess")
    })
  }
  async function handleContent(data) {
    console.log(data)
    const p = {
      id: data.id,
      type: data.type,
      content: data.content,
      createPerson: user.account,
      reportId: data.reportId,
      machineId: data.machineId,
      crateTime: data.createTime,
    }
    data.isEdit = false

    await request.post("work/updateWorkListType", p)
    ElMessage.success("编辑成功")
    emit("onSuccess")
  }
</script>
<template>
  <div>
    <div style="width: 80px"> {{ title }}:</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="machineName" label="设备" width="60" />
      <el-table-column prop="content" label="说明">
        <template #default="scope">
          <el-input
            @blur="handleContent(scope.row)"
            v-if="scope.row.isEdit"
            v-model="scope.row.content"
          />
          <div v-else>
            {{ scope.row.content }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createName" label="创建人" width="80" />
      <el-table-column v-if="!current" prop="createTime" label="创建时间" width="170" />
      <el-table-column prop="completePersonName" label="完成人" width="80" />
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-switch
            class="w-[68px]"
            v-model="scope.row.type"
            :width="62"
            inline-prompt
            active-value="1"
            inactive-value="0"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="已完成"
            inactive-text="未完成"
            @change="handleChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="current && !isBanzhang" label="操作" width="80">
        <template #default="scope">
          <div class="flex items-center">
            <el-icon
              @click="scope.row.isEdit = true"
              class="cursor-pointer mt-0.5"
              :size="20"
              color="#409EFF"
            >
              <Edit />
            </el-icon>
            <el-icon
              @click="handleDelete(scope.row.id)"
              class="ml-2 cursor-pointer"
              :size="20"
              color="#F56C6C"
            >
              <Delete />
            </el-icon>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
