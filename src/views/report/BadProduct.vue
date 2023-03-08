<script setup lang="ts">
  import { toRefs, reactive, ref, watch } from "vue"
  import request from "@/common/request"
  const props = defineProps({
    showDV: {
      type: Boolean,
      default: false,
    },
    badTypeId: {
      type: String,
      default: "",
    },
    badTypeName: {
      type: String,
      default: "",
    },
    planOrderName: {
      type: String,
      default: "",
    },
  })
  const { showDV, badTypeId, badTypeName, planOrderName } = toRefs(props)
  const emit = defineEmits(["update:showDV"])
  function closeDV() {
    emit("update:showDV", false)
  }
  watch(showDV, (val) => {
    if (val) {
      getList()
    }
    console.log(badTypeId.value)
  })
  const tableData = ref([])
  async function getList() {
    const p = {
      planOrderName: planOrderName.value,
      isContainZero: 0,
      badTypeId: badTypeId.value,
    }
    const res = await request.post("operate/selectBadPHistory", p)
    tableData.value = res.list
  }
</script>
<template>
  <el-dialog v-model="showDV" :title="badTypeName + '记录'" width="520px" @close="closeDV">
    <el-table stripe :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" :width="70" />
      <el-table-column prop="operatorName" label="操作人" />
      <el-table-column prop="count" label="数量" />
      <el-table-column prop="operateTime" label="操作时间" :width="200" />
    </el-table>
  </el-dialog>
</template>
