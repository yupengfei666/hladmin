<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"

  const testData = [
    {
      a1: "设备号",
      a2: "",
      a3: "",
      a4: "接班6S确认",
      a5: "品番",
      a6: "取数",
      a7: "节拍（秒）",
      a8: "产量（件）",
      a9: "模具上油",
      a10: "外观品质确认",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },

    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "1",
      a11: "2",
      a12: "3",
      a13: "4",
      a14: "5",
      a15: "6",
    },

    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
    {
      a1: "",
      a2: "",
      a3: "",
      a4: "",
      a5: "",
      a6: "",
      a7: "",
      a8: "",
      a9: "",
      a10: "",
      a11: "",
      a12: "",
      a13: "",
      a14: "",
      a15: "",
    },
  ]
  //合并
  interface Date {
    a1: string
    a2: string
    a3: string
    a4: string
    a5: number
    a6: string
    a7: string
    a8: string
    a9: string
    a10: string
    a11: string
    a12: string
    a13: string
    a14: string
    a15: string
  }

  interface SpanMethodProps {
    row: Date
    column: TableColumnCtx<Date>
    rowIndex: number
    columnIndex: number
  }

  const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
    if (rowIndex === 0) {
      if (columnIndex === 0) {
        return [2, 3]
      } else if (columnIndex == 9) {
        return [1, 6]
      } else if (columnIndex >= 3 && columnIndex <= 8) {
        return [2, 1]
      } else if (columnIndex === 1 || columnIndex === 2 || columnIndex > 9) {
        return [0, 0]
      }
    }
    if (rowIndex === 1) {
      if (columnIndex <= 8) {
        return [0, 0]
      }
    }
    //下面的主要内容
    if ((rowIndex < 12 && rowIndex >= 2) || rowIndex == 18) {
      if (columnIndex == 0) {
        return [1, 3]
      } else if (columnIndex == 1 || columnIndex == 2) {
        return [0, 0]
      }
    }
  }
</script>

<template>
  <ExportExcelButton fileName="工作日报" style="margin-top: 5px"></ExportExcelButton>

  <el-table
    id="out-table"
    :data="testData"
    style="width: 100%; margin-top: 5px"
    height="95%"
    :span-method="arraySpanMethod"
    stripe
    border
    :show-header="false"
    :cell-style="{ padding: '0px' }"
    :row-style="{ height: '45px' }"
  >
    <el-table-column align="center" prop="a1" label="a1" width="50" />
    <el-table-column align="center" prop="a2" label="a2" width="20" />
    <el-table-column align="center" prop="a3" label="a3" width="20" />
    <el-table-column align="center" prop="a4" label="a4" width="70" />
    <el-table-column align="center" prop="a5" label="a5" width="70" />
    <el-table-column align="center" prop="a6" label="a6" width="70" />
    <el-table-column align="center" prop="a7" label="a7" width="70" />
    <el-table-column align="center" prop="a8" label="a8" width="70" />
    <el-table-column align="center" prop="a9" label="a9" width="70" />
    <el-table-column align="center" prop="a10" label="a10" width="36" />
    <el-table-column align="center" prop="a11" label="a11" width="36" />
    <el-table-column align="center" prop="a12" label="a12" width="36" />
    <el-table-column align="center" prop="a13" label="a13" width="36" />
    <el-table-column align="center" prop="a14" label="a14" width="36" />
    <el-table-column align="center" prop="a15" label="a15" width="36" />
  </el-table>
</template>
<style></style>
