<script setup lang="ts">
  import { toRefs, watch, ref } from "vue"
  import WorkList from "./WorkList.vue"
  import { ElMessage } from "element-plus"
  import request from "@/common/request"
  const props = defineProps({
    showDV: {
      type: Boolean,
      default: false,
    },
    currentList: {
      type: Array,
      default: () => [],
    },
    lastList: {
      type: Array,
      default: () => [],
    },
    isBanzhang: {
      type: Boolean,
      default: false,
    },
  })
  const { showDV, currentList, lastList } = toRefs(props)
  const emit = defineEmits(["update:showDV", "onSuccess"])
  function closeDV() {
    emit("update:showDV", false)
  }
  watch(lastList, (val) => {
    if (val) {
    }
  })
  const content = ref("")
  async function handleSubmit() {
    const userStorge = JSON.parse(sessionStorage.getItem("currentUser") as string)
    const p = {
      type: 0,
      content: content.value,
      createPerson: userStorge.account,
      reportId: "",
      machineId: "",
    }
    await request.post("work/addWorkList", p)
    content.value = ""
    ElMessage.success("新增成功")
    emit("onSuccess")
  }
</script>
<template>
  <el-dialog v-model="showDV" title="交接班说明" width="95%" top="5vh" @close="closeDV">
    <div style="display: flex; height: calc(100vh - 220px)">
      <div style="height: 100%; width: 55.5%">
        <el-scrollbar>
          <WorkList
            :current="false"
            @on-success="emit('onSuccess')"
            title="接班记录"
            :list="lastList"
            :is-banzhang="isBanzhang"
          ></WorkList>
        </el-scrollbar>
      </div>
      <div style="width: 2px; height: 100%; background-color: lightgray"> </div>
      <div style="height: 100%; width: calc(100% - 55.5% - 2px); padding-left: 10px">
        <el-scrollbar>
          <div class="flex">
            <el-input v-model="content" placeholder="请输入内容" />
            <el-button @click="handleSubmit" type="success" class="ml-4">新增</el-button>
          </div>
          <WorkList
            class="mt-2"
            @on-success="emit('onSuccess')"
            title="交班记录"
            :list="currentList"
            :is-banzhang="isBanzhang"
          ></WorkList>
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>
