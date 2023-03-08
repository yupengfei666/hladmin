<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import request from "@/common/request"
  import dayjs from "dayjs"
  import ExportExcelButton from "../../common/ExportExcelButton.vue"
  import MachineSelect from "../../common/MachineSelect.vue"
  import { tableHeadF } from "./TableRow"
  const tableData = ref([])
  const temp5 = {
    a1: "非常停止确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp6 = {
    a1: "安全门确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp7 = {
    a1: "喷嘴对正确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp8 = {
    a1: "吸盘吸嘴破损确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp9 = {
    a1: "吸盘吸嘴擦拭",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp10 = {
    a1: "设备异常音确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp11 = {
    a1: "监视画面打开确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp12 = {
    a1: "顶出确认检查",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp13 = {
    a1: "模具型腔清洁",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp14 = {
    a1: "水管连接确认",
    a2: "1次/班",
    a3: 1304,
    a4: "1次/班",
  }
  const temp15 = {
    a1: "SPRAR温度确认",
    a2: "3次/班",
    a3: "a3",
    a4: "3次/班",
  }
  const temp16 = {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
  }
  const temp17 = {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
  }
  const temp18 = {
    a1: "周边设备运转确认",
    a2: "3次/班",
    a3: 1304,
    a4: "3次/班",
  }
  const temp19 = {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
  }
  const temp20 = {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
  }
  const temp21 = {
    a1: "成型条件确认",
    a2: "",
    a3: "",
    a4: "1次/班",
  }
  const temp22 = {
    a1: "温度记录表",
    a2: "D勤",
    a3: "材料干燥",
    a4: "1次/班",
  }
  const temp23 = {
    a1: "",
    a2: "D勤",
    a3: "动模",
    a4: "1次/班",
  }
  const temp24 = {
    a1: "",
    a2: "D勤",
    a3: "定模",
    a4: "1次/班",
  }
  const temp25 = {
    a1: "",
    a2: "E勤",
    a3: "材料干燥",
    a4: "1次/班",
  }
  const temp26 = {
    a1: "",
    a2: "E勤",
    a3: "动模",
    a4: "1次/班",
  }
  const temp27 = {
    a1: "",
    a2: "E勤",
    a3: "定模",
    a4: "1次/班",
  }
  const temp28 = {
    a1: "点检担当",
    a2: "",
    a3: "D勤",
    a4: "a4",
  }
  const temp29 = {
    a1: "点检担当",
    a2: "",
    a3: "E勤",
    a4: "a4",
  }
  const temp30 = {
    a1: "班长确认",
    a2: "",
    a3: "D勤",
    a4: "a4",
  }
  const temp31 = {
    a1: "",
    a2: "",
    a3: "E勤",
    a4: "",
  }

  const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    //第一行
    if (rowIndex == 0) {
      if (columnIndex == 4) {
        return [1, 3]
      } else if (columnIndex == 8) {
        return [1, 3]
      } else if (columnIndex == 11) {
        return [1, 2]
      } else if (columnIndex == 13) {
        return [1, 2]
      } else if (
        columnIndex === 5 ||
        columnIndex === 6 ||
        columnIndex == 9 ||
        columnIndex == 12 ||
        columnIndex == 14 ||
        columnIndex == 10
      ) {
        return [0, 0]
      }
    } else if (rowIndex == 1) {
      //第2行
      if (columnIndex == 0) {
        return [1, 3]
      } else if (columnIndex == 3) {
        return [1, 4]
      } else if (columnIndex > 3 && columnIndex <= 6) {
        return [0, 0]
      } else if (columnIndex > 0 && columnIndex <= 2) {
        return [0, 0]
      }
    } else if (rowIndex === 2) {
      //以下为主要内容
      if (columnIndex === 0) {
        return [2, 3]
      } else if (columnIndex === 3) {
        return [2, 1]
      } else if (columnIndex === 1 || columnIndex === 2) {
        return [0, 0]
      }
      if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 5 && columnIndex % 2 !== 0) {
        return [0, 0]
      }
    } else if (rowIndex === 3) {
      if (columnIndex <= 3) {
        return [0, 0]
      }
    } else if ((rowIndex < 14 && rowIndex >= 4) || rowIndex == 20) {
      if (columnIndex == 0) {
        return [1, 3]
      } else if (columnIndex == 1 || columnIndex == 2) {
        return [0, 0]
      }
    } else if (rowIndex === 14 || rowIndex === 17) {
      if (columnIndex == 0) {
        return [3, 3]
      } else if (columnIndex == 3) {
        return [3, 1]
      } else if (columnIndex === 1 || columnIndex === 2) {
        return [0, 0]
      }
    } else if (rowIndex === 15 || rowIndex === 16 || rowIndex === 18 || rowIndex === 19) {
      if (columnIndex <= 3) {
        return [0, 0]
      }
    } else if (rowIndex == 21) {
      // 温度记录表
      if (columnIndex == 0) {
        return [6, 1]
      } else if (columnIndex == 1) {
        return [3, 1]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      }
    } else if (rowIndex == 22) {
      if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      } else if (columnIndex == 0 || columnIndex == 1) {
        return [0, 0]
      }
    } else if (rowIndex == 23) {
      if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      } else if (columnIndex == 0 || columnIndex == 1) {
        return [0, 0]
      }
    } else if (rowIndex == 24) {
      if (columnIndex == 1) {
        return [3, 1]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      } else if (columnIndex == 0 || columnIndex == 1) {
        return [0, 0]
      }
    } else if (rowIndex == 25 || rowIndex == 26) {
      if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      } else if (columnIndex == 0 || columnIndex == 1) {
        return [0, 0]
      }
    } else if (rowIndex == 27) {
      //点检担当与班长确认
      if (columnIndex == 0) {
        return [2, 2]
      } else if (columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex == 1 || columnIndex == 3) {
        return [0, 0]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      }
    } else if (rowIndex == 28) {
      if (columnIndex == 0 || columnIndex == 1 || columnIndex == 3) {
        return [0, 0]
      } else if (columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      }
    } else if (rowIndex == 29) {
      if (columnIndex == 0) {
        return [2, 2]
      } else if (columnIndex == 1 || columnIndex == 3) {
        return [0, 0]
      } else if (columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      }
    } else if (rowIndex == 30) {
      if (columnIndex <= 1 || columnIndex == 3) {
        return [0, 0]
      } else if (columnIndex == 2) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 == 0) {
        return [1, 2]
      } else if (columnIndex >= 4 && columnIndex % 2 != 0) {
        return [0, 0]
      }
    }
  }

  const formHead = reactive({
    month: dayjs().format("YYYY-MM") + "-01 00:00:00",
    machineId: "",
    machineName: "",
  })
  function SelectMachineByMachineId(data: any) {
    formHead.machineId = data.id
    formHead.machineName = data.name
    getList()
  }
  function changeMonth(data) {
    formHead.month = data + "-01 00:00:00"
  }
  onMounted(() => {})
  const key = ref(Math.random())
  const dayTotal = ref(28)
  async function getList() {
    tableData.value = []
    const p = {
      machineId: formHead.machineId,
      startTime: formHead.month,
    }
    const monthT = dayjs(formHead.month).format("YYYY年MM月")
    dayTotal.value = dayjs(formHead.month).daysInMonth()
    tableData.value = tableHeadF(monthT, formHead.machineName, dayTotal.value)
    // 由于分段给table赋值，所以增加key 手动触发刷新
    key.value = Math.random()
    const res = await request.post("operate/selectCheckByDate", p)

    for (const item of res.list) {
      // 获取天数所在列 3 + 天数*2 + 0(D)/1(E)
      let tempIndex = 3 + item.reportDate.slice(-2) * 2
      tempIndex = item.qinwu === "D勤" ? tempIndex : tempIndex + 1
      temp5["a" + tempIndex] = item.fctzqr === "是" ? "√" : "x"
      temp6["a" + tempIndex] = item.aqmqr === "是" ? "√" : "x"
      temp7["a" + tempIndex] = item.pzdzqr === "是" ? "√" : "x"
      temp8["a" + tempIndex] = item.xpxzpsqr === "是" ? "√" : "x"
      temp9["a" + tempIndex] = item.xpxzcs === "是" ? "√" : "x"
      temp10["a" + tempIndex] = item.sbycyqr === "是" ? "√" : "x"
      temp11["a" + tempIndex] = item.jshmdkqr === "是" ? "√" : "x"
      temp12["a" + tempIndex] = item.dcqrjc === "是" ? "√" : "x"
      temp13["a" + tempIndex] = item.mjxqqj === "是" ? "√" : "x"
      temp14["a" + tempIndex] = item.sgljqr === "是" ? "√" : "x"
      temp15["a" + tempIndex] = item.sprarone === "是" ? "√" : "x"
      temp16["a" + tempIndex] = item.sprartwo === "是" ? "√" : "x"
      temp17["a" + tempIndex] = item.sprarthree === "是" ? "√" : "x"
      temp18["a" + tempIndex] = item.zbsbyzqrone === "是" ? "√" : "x"
      temp19["a" + tempIndex] = item.zbsbyzqrtwo === "是" ? "√" : "x"
      temp20["a" + tempIndex] = item.zbsbyzqrthree === "是" ? "√" : "x"
      temp21["a" + tempIndex] = item.cxtjqr === "是" ? "√" : "x"
      if (item.qinwu === "D勤") {
        temp22["a" + tempIndex] = item.wdjlclgz
        temp23["a" + tempIndex] = item.wdjldm
        temp24["a" + tempIndex] = item.wdjldingm
        temp28["a" + tempIndex] = item.operatorName
        temp30["a" + tempIndex] = item.approverName
      } else {
        // 由于合并 向前移一位
        const tempIndexE = tempIndex - 1
        temp25["a" + tempIndexE] = item.wdjlclgz
        temp26["a" + tempIndexE] = item.wdjldm
        temp27["a" + tempIndexE] = item.wdjldingm
        temp29["a" + tempIndexE] = item.operatorName
        temp31["a" + tempIndexE] = item.approverName
      }
    }
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
    tableData.value[19] = temp19
    tableData.value[20] = temp20
    tableData.value[21] = temp21
    tableData.value[22] = temp22
    tableData.value[23] = temp23
    tableData.value[24] = temp24
    tableData.value[25] = temp25
    tableData.value[26] = temp26
    tableData.value[27] = temp27
    tableData.value[28] = temp28
    tableData.value[29] = temp29
    tableData.value[30] = temp30
    tableData.value[31] = temp31
  }
</script>

<template>
  <header>
    <el-form :inline="true" :model="formHead" style="margin-top: 8px; margin-left: 8px">
      <el-form-item label="机床号">
        <MachineSelect
          :selected-first="true"
          :is-clear="false"
          @selected-item="SelectMachineByMachineId"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item label="月份:">
        <el-date-picker
          v-model="formHead.month"
          type="month"
          placeholder="请选择月份"
          value-format="YYYY-MM"
          @change="changeMonth"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <ExportExcelButton fileName="机床点检" :show-last-column="true"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>

  <el-table
    id="out-table"
    :data="tableData"
    style="margin-top: 5px"
    height="calc(100vh - 65px)"
    :span-method="arraySpanMethod"
    border
    :show-header="false"
    stripe
    :key="key"
  >
    <el-table-column fixed prop="a1" label="a1" width="50" />
    <el-table-column fixed prop="a2" label="a2" width="40" />
    <el-table-column align="center" fixed prop="a3" label="a3" width="60" />
    <el-table-column align="center" fixed prop="a4" label="a4" width="85" />
    <el-table-column align="center" prop="a5" label="a5" width="40" />
    <el-table-column align="center" prop="a6" label="a6" width="40" />
    <el-table-column align="center" prop="a7" label="a7" width="40" />
    <el-table-column align="center" prop="a8" label="a8" width="40" />
    <el-table-column align="center" prop="a9" label="a9" width="40" />
    <el-table-column align="center" prop="a10" label="a10" width="40" />
    <el-table-column align="center" prop="a11" label="a11" width="40" />
    <el-table-column align="center" prop="a12" label="a12" width="40" />
    <el-table-column align="center" prop="a13" label="a13" width="40" />
    <el-table-column align="center" prop="a14" label="a14" width="40" />
    <el-table-column align="center" prop="a15" label="a15" width="40" />
    <el-table-column align="center" prop="a16" label="a16" width="40" />
    <el-table-column align="center" prop="a17" label="a17" width="40" />
    <el-table-column align="center" prop="a18" label="a18" width="40" />
    <el-table-column align="center" prop="a19" label="a19" width="40" />
    <el-table-column align="center" prop="a20" label="a20" width="40" />
    <el-table-column align="center" prop="a21" label="a21" width="40" />
    <el-table-column align="center" prop="a22" label="a22" width="40" />
    <el-table-column align="center" prop="a23" label="a23" width="40" />
    <el-table-column align="center" prop="a24" label="a24" width="40" />
    <el-table-column align="center" prop="a25" label="a25" width="40" />
    <el-table-column align="center" prop="a26" label="a26" width="40" />
    <el-table-column align="center" prop="a27" label="a27" width="40" />
    <el-table-column align="center" prop="a28" label="a28" width="50" />
    <el-table-column align="center" prop="a29" label="a29" width="40" />
    <el-table-column align="center" prop="a30" label="a30" width="40" />
    <el-table-column align="center" prop="a31" label="a31" width="40" />
    <el-table-column align="center" prop="a32" label="a32" width="40" />
    <el-table-column align="center" prop="a33" label="a33" width="40" />
    <el-table-column align="center" prop="a34" label="a34" width="40" />
    <el-table-column align="center" prop="a35" label="a35" width="40" />
    <el-table-column align="center" prop="a36" label="a36" width="40" />
    <el-table-column align="center" prop="a37" label="a37" width="40" />
    <el-table-column align="center" prop="a38" label="a38" width="40" />
    <el-table-column align="center" prop="a39" label="a39" width="40" />
    <el-table-column align="center" prop="a40" label="a40" width="40" />
    <el-table-column align="center" prop="a41" label="a41" width="40" />
    <el-table-column align="center" prop="a42" label="a42" width="40" />
    <el-table-column align="center" prop="a43" label="a43" width="40" />
    <el-table-column align="center" prop="a44" label="a44" width="40" />
    <el-table-column align="center" prop="a45" label="a45" width="40" />
    <el-table-column align="center" prop="a46" label="a46" width="40" />
    <el-table-column align="center" prop="a47" label="a47" width="40" />
    <el-table-column align="center" prop="a48" label="a48" width="40" />
    <el-table-column align="center" prop="a49" label="a49" width="40" />
    <el-table-column align="center" prop="a50" label="a50" width="40" />
    <el-table-column align="center" prop="a51" label="a51" width="40" />
    <el-table-column align="center" prop="a52" label="a52" width="40" />
    <el-table-column align="center" prop="a53" label="a53" width="40" />
    <el-table-column align="center" prop="a54" label="a54" width="40" />
    <el-table-column align="center" prop="a55" label="a55" width="40" />
    <el-table-column align="center" prop="a56" label="a56" width="40" />
    <el-table-column align="center" prop="a57" label="a57" width="40" />
    <el-table-column align="center" prop="a58" label="a58" width="40" />
    <el-table-column align="center" prop="a59" label="a59" width="40" />
    <el-table-column align="center" prop="a60" label="a60" width="40" />
    <el-table-column v-if="dayTotal > 28" align="center" prop="a61" label="a61" width="40" />
    <el-table-column v-if="dayTotal > 28" align="center" prop="a62" label="a62" width="40" />
    <el-table-column v-if="dayTotal > 29" align="center" prop="a63" label="a63" width="40" />
    <el-table-column v-if="dayTotal > 29" align="center" prop="a64" label="a64" width="40" />
    <el-table-column v-if="dayTotal > 30" align="center" prop="a65" label="a65" width="40" />
    <el-table-column v-if="dayTotal > 30" align="center" prop="a66" label="a66" width="40" />
  </el-table>
</template>
