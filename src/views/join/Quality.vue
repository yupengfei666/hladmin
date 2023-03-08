<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import type { FormInstance, FormRules } from "element-plus"
  import { ElMessageBox, ElMessage } from "element-plus"
  import request from "../../common/request"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import MachineSelect from "../common/MachineSelect.vue"

  onMounted(async () => {
    getPinZhi()
  })
  const PinZhiList = reactive({
    list: [],
  })
  function getPinZhi() {
    request.post("/work/selectQualityCount", { data: "" }).then((data) => {
      PinZhiList.list = data
      console.log("获取品质的信息", PinZhiList)
    })
  }
</script>

<template>
  <div class="main">
    <el-row :gutter="20" style="margin-left: 21%">
      <el-col :span="9">
        <el-card class="together" shadow="hover">
          不良品数量：{{ PinZhiList.list.defectiveQuantity }}
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card shadow="hover" class="together">
          不合格品数量：{{ PinZhiList.list.nonconformingQuantity }}
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card shadow="hover" class="together">
          待加工数量：{{ PinZhiList.list.processedQuantity }}
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card shadow="hover" class="together">
          待检品数量：{{ PinZhiList.list.testedQuantity }}
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
  .together {
    height: 200px;
    margin-bottom: 10px;
    border: 1px solid rgb(204, 201, 201);
    border-radius: 15px;
  }
</style>
