<script lang="ts" setup>
  import { ref, reactive } from "vue"
  import BoardMain from "../common/BoardMain.vue"
  import _ from "lodash-es"
  import request from "../../common/request"
  import PersonBox from "./PersonBox.vue"
  import { getCategorysByMouldDetail } from "@/common/common"
  const personList = ref([])
  let machineList = []
  let personT = ""
  let personNameT = ""
  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    console.log(res)
    machineList = res.list
    // 判断 操作者 || 加工者
    personT = personType.value === 1 ? "caoZuo" : "jiaGong"
    personNameT = personType.value === 1 ? "caozuoName" : "jiagongName"
    doList()
  }
  function listObj(item) {
    item.showCategorys = getCategorysByMouldDetail(item.mould_detail)
    return {
      id: item.id,
      name: item.name,
      color: item.color,
      type: item.isError ? item.statusName : "",
      jdl: Math.floor(Math.random() * 100),
      tons: item.tons,
      completeI: item.count,
      totalI: item.quantity,
      jz: item.machine_Name,
      jzName: item.showCategorys,
    }
  }
  function doList() {
    const listTemp = {}
    for (const item of machineList) {
      // 已分配人
      if (item[personT]) {
        if (listTemp[item[personT]]) {
          listTemp[item[personT]].machineList.push(listObj(item))
        } else {
          listTemp[item[personT]] = {
            name: item[personNameT],
            machineList: [listObj(item)],
          }
        }
      } else {
        // 未分配的机床
        if (listTemp["未分配"]) {
          listTemp["未分配"].machineList.push(listObj(item))
        } else {
          listTemp["未分配"] = {
            name: "未分配",
            machineList: [listObj(item)],
          }
        }
      }
    }
    console.log(888)
    console.log(listTemp)

    personList.value = Object.values(listTemp)
    console.log(3464)
    console.log(personList.value)
  }
  getDeviceArr()
  const personType = ref(1)
  function changePersonType() {
    personT = personType.value === 1 ? "caoZuo" : "jiaGong"
    personNameT = personType.value === 1 ? "caozuoName" : "jiagongName"
    doList()
  }
</script>
<template>
  <div id="machineByPerson">
    <BoardMain title="成形车间机床分配">
      <template #context
        ><div>
          <el-radio-group v-model="personType" @change="changePersonType">
            <el-radio :label="1">操作担当</el-radio>
            <el-radio :label="2">加工担当</el-radio>
          </el-radio-group>
        </div>
        <el-scrollbar height="calc(100vh - 98px)">
          <div class="box">
            <PersonBox :list="personList"></PersonBox>
          </div> </el-scrollbar
      ></template>
    </BoardMain>
  </div>
</template>
<style lang="less">
  #machineByPerson {
    .el-radio {
      color: white;
    }
    .el-scrollbar__wrap {
      padding: 5px;
      box-sizing: border-box;
    }
  }
</style>

<style lang="less" scoped></style>
