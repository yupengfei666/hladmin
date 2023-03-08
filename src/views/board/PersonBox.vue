<script lang="ts" setup>
  import { toRefs } from "vue"
  import BoardMachineBox from "@/views/common/BoardMachineBox.vue"

  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  })
  const { list } = toRefs(props)
</script>
<template>
  <div style="height: 100%" id="groupList">
    <el-scrollbar height="100%">
      <div class="b-person" v-for="item in list" :key="item.name">
        <div style="margin-left: 10px; width: 60px">{{ item.name }}</div>

        <div style="margin-left: 20px; display: flex; flex-wrap: wrap; width: calc(100vw - 60px)"
          ><BoardMachineBox
            :machine="itemC"
            v-for="itemC in item.machineList"
            :key="itemC.name"
          ></BoardMachineBox></div
      ></div>
    </el-scrollbar>
  </div>
</template>
<style lang="less">
  #groupList {
    .el-scrollbar__wrap {
      padding: 3px;
    }
  }
</style>
<style lang="less" scoped>
  .b-person {
    padding: 5px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid lightgray;
    .jc {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #45b23d;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
</style>
