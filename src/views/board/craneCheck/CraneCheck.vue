<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../../common/ExportExcelButton.vue"
  import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults"
  import { ElMessage, type FormInstance, type FormRules } from "element-plus"
  import request from "../../../common/request"
  import { tableRow } from "./TableRow"

  const tempData = [
    {
      dg: "1",
      aqm: "1",
      czhOne: "1",
      czhTwo: "1",
      dcgss: "1",
      xchxc: "1",
      dgsxdz: "1",
      xcnbdz: "1",
      dcdxdz: "1",
      ycy: "1",
      dwydd: "1",
      dgddxwq: "1",
      dcdbxwq: "1",
      xcdbxwq: "1",
      operator: "路飞",
      approver: "罗宾",
      checkTime: "2022-09-19 12:12:12",
      ycjl: "大车有异常",
      cldc: "没有对策",
      cljg: "找人维修",
      ycqrPerson: "乔巴",
    },
    {
      dg: "1",
      aqm: "1",
      czhOne: "1",
      czhTwo: "1",
      dcgss: "1",
      xchxc: "0",
      dgsxdz: "1",
      xcnbdz: "1",
      dcdxdz: "1",
      ycy: "1",
      dwydd: "1",
      dgddxwq: "1",
      dcdbxwq: "1",
      xcdbxwq: "0",
      operator: "卡普",
      approver: "明哥",
      checkTime: "",
      ycjl: "",
      cldc: "",
      cljg: "",
      ycqrPerson: "",
    },
  ]
  const tableData = ref<any>([])
  tableData.value = tableRow
  const temp2 = {
    a1: "1",
    a2: "",
    a3: "吊钩确认",
    a4: "",
    a5: "不能有损伤、裂纹等情况",
    a6: "",
    a7: "",
  }
  const temp3 = {
    a1: "2",
    a2: "",
    a3: "安全帽确认",
    a4: "",
    a5: "不能有裂纹：帽带安全可靠",
    a6: "",
    a7: "0",
  }
  const temp4 = {
    a1: "3",
    a2: "",
    a3: "操作盒确认",
    a4: "",
    a5: "按钮按下后，吊车应立即动作，按钮松开后，按钮应立即弹出，吊车停止动作",
    a6: "",
    a7: "0",
  }
  const temp5 = {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "6",
  }
  const temp6 = {
    a1: "4",
    a2: "",
    a3: "吊车钢丝绳确认",
    a4: "",
    a5: "能有断丝、折痕等情况",
    a6: "",
    a7: "0",
  }
  const temp7 = {
    a1: "5",
    a2: "",
    a3: "小车划线槽确认",
    a4: "",
    a5: "划线槽接口处不能有异常",
    a6: "",
    a7: "0",
  }
  const temp8 = {
    a1: "6",
    a2: "",
    a3: "吊钩上下动作确认",
    a4: "",
    a5: "松开按钮，吊钩立即停止工作",
    a6: "",
    a7: "0",
  }
  const temp9 = {
    a1: "7",
    a2: "",
    a3: "小车南北动作确认",
    a4: "",
    a5: "启动时无扭动，停止时滑行半米以内",
    a6: "",
    a7: "0",
  }
  const temp10 = {
    a1: "8",
    a2: "",
    a3: "大车东西动作确认",
    a4: "",
    a5: "启动时无扭动，停止时滑行一米以内",
    a6: "",
    a7: "0",
  }
  const temp11 = {
    a1: "9",
    a2: "",
    a3: "异常音确认",
    a4: "",
    a5: "吊车运行时不能有任何异常声音",
    a6: "",
    a7: "0",
  }
  const temp12 = {
    a1: "10",
    a2: "",
    a3: "吊物用吊带，钢丝绳确认",
    a4: "",
    a5: "损伤不能超过其厚度（直径）的10%",
    a6: "",
    a7: "0",
  }
  const temp13 = {
    a1: "11",
    a2: "",
    a3: "吊钩顶端限位器确认",
    a4: "",
    a5: "吊钩碰到限位器后，停止运行",
    a6: "",
    a7: "0",
  }
  const temp14 = {
    a1: "12",
    a2: "",
    a3: "大车端部限位器确认",
    a4: "",
    a5: "大车碰到限位器后，停止运行",
    a6: "",
    a7: "0",
  }
  const temp15 = {
    a1: "13",
    a2: "",
    a3: "小车端部限位器确认",
    a4: "",
    a5: "小车碰到限位器后，停止运行",
    a6: "",
    a7: "0",
  }
  const temp16 = {
    a1: "担当确认",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "0",
  }
  const temp17 = {
    a1: "班长确认",
    a2: "",
    a3: "",
    a4: "",
    a5: "",
    a6: "",
    a7: "",
  }
  const temp18 = {
    a1: "日期",
    a2: "",
    a3: "",
    a4: "",
    a5: "异常记录",
    a6: "",
    a7: "",
    a8: "",
    a9: "",
    a10: "",
    a11: "",
    a12: "",
    a13: "",
    a14: "处理对策",
    a15: "",
    a16: "",
    a17: "",
    a18: "",
    a19: "",
    a20: "",
    a21: "",
    a22: "",
    a23: "",
    a24: "",
    a25: "处理结果",
    a26: "",
    a27: "",
    a28: "",
    a29: "",
    a30: "",
    a31: "",
    a32: "",
    a33: "",
    a34: "",
    a35: "",
    a36: "确认",
    a37: "",
    a38: "",
  }
  tableData.value[2] = temp2
  tableData.value[3] = temp3
  tableData.value[4] = temp4
  tableData.value[5] = temp5
  tableData.value[6] = temp6
  tableData.value[7] = temp7
  tableData.value[8] = temp8
  tableData.value[9] = temp9
  tableData.value[10] = temp10
  tableData.value[11] = temp11
  tableData.value[12] = temp12
  tableData.value[13] = temp13
  tableData.value[14] = temp14
  tableData.value[15] = temp15
  tableData.value[16] = temp16
  tableData.value[17] = temp17
  tableData.value[18] = temp18
  for (const [index, item] of tempData.entries()) {
    const tempIndex = index + 8
    temp2["a" + tempIndex] = item.dg === "1" ? "√" : "x"
    temp3["a" + tempIndex] = item.aqm === "1" ? "√" : "x"
    temp4["a" + tempIndex] = item.czhOne === "1" ? "√" : "x"
    temp5["a" + tempIndex] = item.czhTwo === "1" ? "√" : "x"
    temp6["a" + tempIndex] = item.dcgss === "1" ? "√" : "x"
    temp7["a" + tempIndex] = item.xchxc === "1" ? "√" : "x"
    temp8["a" + tempIndex] = item.dgsxdz === "1" ? "√" : "x"
    temp9["a" + tempIndex] = item.xcnbdz === "1" ? "√" : "x"
    temp10["a" + tempIndex] = item.dcdxdz === "1" ? "√" : "x"
    temp11["a" + tempIndex] = item.ycy === "1" ? "√" : "x"
    temp12["a" + tempIndex] = item.dwydd === "1" ? "√" : "x"
    temp13["a" + tempIndex] = item.dgddxwq === "1" ? "√" : "x"
    temp14["a" + tempIndex] = item.dcdbxwq === "1" ? "√" : "x"
    temp15["a" + tempIndex] = item.xcdbxwq === "1" ? "√" : "x"
    temp16["a" + tempIndex] = item.operator
    temp17["a" + tempIndex] = item.approver
    if (item.ycjl) {
      tableData.value.push({
        a1: item.checkTime,
        a5: item.ycjl,
        a14: item.cljg,
        a25: item.cldc,
        a36: item.ycqrPerson,
      })
    }
  }

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
    a16: string
    a17: string
    a18: string
    a19: string
    a20: string
    a21: string
    a22: string
    a23: string
    a24: string
    a25: string
    a26: string
    a27: string
    a28: string
    a29: string
    a30: string
    a31: string
    a32: string
    a33: string
    a34: string
    a35: string
    a36: string
    a37: string
    a38: string
  }

  interface SpanMethodProps {
    row: Date
    column: TableColumnCtx<Date>
    rowIndex: number
    columnIndex: number
  }

  const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
    if (rowIndex == 0) {
      if (columnIndex == 0 || columnIndex == 2) {
        return [2, 2]
      } else if (columnIndex == 4) {
        return [2, 3]
      } else if (columnIndex == 7) {
        return [1, 31]
      } else if (
        columnIndex == 1 ||
        columnIndex == 3 ||
        columnIndex == 5 ||
        columnIndex == 6 ||
        columnIndex >= 8
      ) {
        return [0, 0]
      }
    } else if (rowIndex == 1) {
      if (columnIndex >= 0 && columnIndex <= 6) {
        return [0, 0]
      }
    } else if (rowIndex == 2 || rowIndex == 3) {
      if (columnIndex == 0 || columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex == 4) {
        return [1, 3]
      } else if (columnIndex == 1 || columnIndex == 3 || columnIndex == 5 || columnIndex == 6) {
        return [0, 0]
      }
    } else if (rowIndex == 4) {
      if (columnIndex == 0 || columnIndex == 2) {
        return [2, 2]
      } else if (columnIndex == 4) {
        return [2, 3]
      } else if (columnIndex == 1 || columnIndex == 3 || columnIndex == 5 || columnIndex == 6) {
        return [0, 0]
      }
    } else if (rowIndex == 5) {
      if (columnIndex >= 0 && columnIndex <= 6) {
        return [0, 0]
      }
    } else if (rowIndex >= 6 && rowIndex <= 15) {
      if (columnIndex == 0 || columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex == 4) {
        return [1, 3]
      } else if (columnIndex == 1 || columnIndex == 3 || columnIndex == 5 || columnIndex == 6) {
        return [0, 0]
      }
    } else if (rowIndex == 16 || rowIndex == 17) {
      if (columnIndex == 0) {
        return [1, 7]
      } else if (columnIndex >= 1 && columnIndex <= 6) {
        return [0, 0]
      }
    } else if (rowIndex == 18 || rowIndex == 19 || rowIndex == 20 || rowIndex == 21) {
      if (columnIndex == 0) {
        return [1, 4]
      } else if (columnIndex == 4) {
        return [1, 9]
      } else if (columnIndex == 13 || columnIndex == 24) {
        return [1, 11]
      } else if (columnIndex == 35) {
        return [1, 3]
      } else if (columnIndex == 36 || columnIndex == 37) {
        return [0, 0]
      } else if (
        (columnIndex >= 1 && columnIndex <= 3) ||
        (columnIndex >= 5 && columnIndex <= 12) ||
        (columnIndex >= 14 && columnIndex <= 23) ||
        (columnIndex >= 25 && columnIndex <= 34)
      ) {
        return [0, 0]
      }
    }
  }
</script>

<template>
  <ExportExcelButton fileName="智能吊车点检" style="margin-top: 5px"></ExportExcelButton>
  <el-table
    id="out-table"
    :data="tableData"
    style="width: 100%; margin-top: 5px"
    height="95%"
    :span-method="arraySpanMethod"
    stripe
    border
    :show-header="false"
    :cell-style="{ padding: '0px' }"
    :row-style="{ height: '45px' }"
  >
    <el-table-column align="center" prop="a1" label="a1" width="40" />
    <el-table-column align="center" prop="a2" label="a2" width="10" />
    <el-table-column align="center" prop="a3" label="a3" width="80" />
    <el-table-column align="center" prop="a4" label="a4" width="80" />
    <el-table-column align="center" prop="a5" label="a5" width="90" />
    <el-table-column align="center" prop="a6" label="a6" width="90" />
    <el-table-column align="center" prop="a7" label="a7" width="70" />
    <el-table-column align="center" prop="a8" label="a8" width="70" />
    <el-table-column align="center" prop="a9" label="a9" width="70" />
    <el-table-column align="center" prop="a10" label="a10" width="70" />
    <el-table-column align="center" prop="a11" label="a11" width="70" />
    <el-table-column align="center" prop="a12" label="a12" width="70" />
    <el-table-column align="center" prop="a13" label="a13" width="70" />
    <el-table-column align="center" prop="a14" label="a14" width="70" />
    <el-table-column align="center" prop="a15" label="a15" width="70" />
    <el-table-column align="center" prop="a16" label="a16" width="70" />
    <el-table-column align="center" prop="a17" label="a17" width="70" />
    <el-table-column align="center" prop="a18" label="a18" width="70" />
    <el-table-column align="center" prop="a19" label="a19" width="70" />
    <el-table-column align="center" prop="a20" label="a20" width="70" />
    <el-table-column align="center" prop="a21" label="a21" width="70" />
    <el-table-column align="center" prop="a22" label="a22" width="70" />
    <el-table-column align="center" prop="a23" label="a23" width="70" />
    <el-table-column align="center" prop="a24" label="a24" width="70" />
    <el-table-column align="center" prop="a25" label="a25" width="70" />
    <el-table-column align="center" prop="a26" label="a26" width="70" />
    <el-table-column align="center" prop="a27" label="a27" width="70" />
    <el-table-column align="center" prop="a28" label="a28" width="70" />
    <el-table-column align="center" prop="a29" label="a29" width="70" />
    <el-table-column align="center" prop="a30" label="a30" width="70" />
    <el-table-column align="center" prop="a31" label="a31" width="70" />
    <el-table-column align="center" prop="a32" label="a32" width="70" />
    <el-table-column align="center" prop="a33" label="a33" width="70" />
    <el-table-column align="center" prop="a34" label="a34" width="70" />
    <el-table-column align="center" prop="a35" label="a35" width="70" />
    <el-table-column align="center" prop="a36" label="a36" width="70" />
    <el-table-column align="center" prop="a37" label="a37" width="70" />
    <el-table-column align="center" prop="a38" label="a38" width="70" />
  </el-table>
</template>
<style></style>
