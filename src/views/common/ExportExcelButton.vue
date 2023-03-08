<script setup lang="ts">
  import { toRefs } from "vue"
  import { exportExcel } from "../../common/utils"
  const props = defineProps({
    buttonStyle: {
      type: String,
      default: "margin-left: 8px",
    },
    buttonText: {
      type: String,
      default: "excel导出",
    },
    tableId: {
      type: String,
      default: "out-table",
    },
    fileName: {
      type: String,
      default: "",
    },
    removeFixed: {
      type: Boolean,
      default: true,
    },
    showLastColumn: {
      type: Boolean,
      default: false,
    },
  })
  const { buttonStyle, buttonText, tableId, fileName, removeFixed, showLastColumn } = toRefs(props)

  function exportExcelF() {
    const fixed = removeFixed.value ? 1 : 0
    exportExcel("#" + tableId.value, fileName.value, fixed, showLastColumn.value)
  }
</script>
<template>
  <div>
    <el-button :style="buttonStyle" type="primary" @click="exportExcelF">
      {{ buttonText }}</el-button
    >
  </div>
</template>
