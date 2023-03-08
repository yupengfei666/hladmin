<script setup lang="ts">
  import { ref } from "vue"
  import _ from "lodash-es"
  import request from "../../common/request"
  import { ElMessage, ElMessageBox } from "element-plus"

  interface BoxDate {
    no: string
    name: string
    bgcolor: string
    machineId: string
  }
  const boxData = ref<BoxDate[]>([])
  for (let i = 1; i <= 18 * 6; i++) {
    let tempNo = ""
    if (i <= 18 * 1) {
      tempNo = "1-" + i
    } else if (i <= 18 * 2) {
      tempNo = "2-" + (i - 18)
    } else if (i <= 18 * 3) {
      tempNo = "3-" + (i - 18 * 2)
    } else if (i <= 18 * 4) {
      tempNo = "4-" + (i - 18 * 3)
    } else if (i <= 18 * 5) {
      tempNo = "5-" + (i - 18 * 4)
    } else if (i <= 18 * 6) {
      tempNo = "6-" + (i - 18 * 5)
    }
    boxData.value.push({
      no: tempNo,
      name: "",
      bgcolor: "white",
      machineId: "",
    })
  }
  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    machineList.value = []
    for (const item of res.list) {
      console.log(item.location)
      if (!item.location) {
        machineList.value.push(item)
      }
    }
    if (machineList.value.length > 0) {
      machineId.value = machineList.value[0].id
    }
    const machineListByLocation = _.keyBy(res.list, "location")
    for (const itemB of boxData.value) {
      if (machineListByLocation[itemB.no]) {
        itemB.machineId = machineListByLocation[itemB.no].id
        itemB.name = machineListByLocation[itemB.no].name
        itemB.bgcolor = "#b3e19d"
      } else {
        itemB.machineId = ""
        itemB.name = ""
        itemB.bgcolor = "white"
      }
    }
    console.log(machineListByLocation)
  }
  getDeviceArr()
  const dialogVisible = ref(false)
  const selectLocation = ref("")
  function changeLocation(val) {
    selectLocation.value = val
    dialogVisible.value = true
  }
  const machineList = ref([])
  const machineId = ref("")
  async function submit(mId = "") {
    let tempId
    if (mId) {
      tempId = mId
      selectLocation.value = ""
    } else {
      tempId = machineId.value
    }
    const p = {
      id: tempId,
      location: selectLocation.value,
    }
    await request.post("machine/updateLocation", p)
    dialogVisible.value = false
    ElMessage({
      type: "success",
      message: "操作成功!",
    })
    await getDeviceArr()
  }
  //删除操作
  function deleteMachine(mid) {
    ElMessageBox.confirm("确认删除此机床吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await submit(mid)
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  const title = ref(["第一排", "第二排", "第三排", "第四排", "大成形1", "大成形2"])
</script>
<template>
  <div style="margin: 4px">机床物理位置选择</div>
  <div style="display: flex">
    <div style="width: 80px; margin-top: 20px">
      <div v-for="item in title" :key="item" class="title-right">
        {{ item }}
      </div></div
    >
    <div
      style="
        width: calc(100% - 80px);
        height: calc(100vh - 94px);
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
        margin-right: 4px;
      "
    >
      <div
        class="box"
        :style="{ backgroundColor: item.bgcolor }"
        v-for="item in boxData"
        :key="item.no"
        ><div
          style="
            display: flex;
            justify-content: center;
            padding-top: 25px;
            flex-direction: column;
            align-items: center;
          "
          ><div>{{ item.name }}</div
          ><el-button
            @click="changeLocation(item.no)"
            type="success"
            size="small"
            plain
            style="margin-top: 5px"
          >
            <span v-if="item.name">替换</span>
            <span v-else>+</span> </el-button
          ><el-button
            v-if="item.name"
            @click="deleteMachine(item.machineId)"
            type="danger"
            size="small"
            plain
            style="margin-top: 5px; margin-left: 0px"
            >删除</el-button
          ></div
        >
      </div>
      <el-dialog v-model="dialogVisible" title="机床选择" center width="400px">
        <el-select
          v-model="machineId"
          filterable
          placeholder="Select"
          style="margin: 0 auto; display: block; width: 80%"
        >
          <el-option
            v-for="item in machineList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit('')">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @height: 130px;
  .box {
    width: 85px;
    height: @height;
    margin: 2px;
    // border: 1px solid #67c23a;
    position: relative;
  }
  .box:hover {
    background-color: #67c23a !important;
  }
  .title-right {
    height: 135px;
    margin: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid lightgray;
  }
</style>
