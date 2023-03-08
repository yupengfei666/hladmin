<script lang="ts" setup>
  import { ref, toRefs, watch } from "vue"
  import request from "../../common/request"
  const props = defineProps({
    selectedFirst: {
      type: Boolean,
      default: false,
    },
    selectMachineId: {
      type: String,
      default: "",
    },
    isClear: {
      type: Boolean,
      default: true,
    },
    isIncludeScrap: {
      // 是否包含报废
      type: Boolean,
      default: false,
    },
  })
  const { selectedFirst, selectMachineId, isClear, isIncludeScrap } = toRefs(props)
  const emit = defineEmits(["selectedItem"])
  const machineList = ref([])
  async function getList() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 100,
    }
    const res: any = await request.post("machine/getAsset", p)
    machineList.value = []
    for (const item of res.list) {
      if (item.isScrap === "否" || isIncludeScrap.value) {
        machineList.value.push(item)
      }
    }
    if (selectMachineId.value) {
      machineId.value = selectMachineId.value
    } else if (selectedFirst.value) {
      machineId.value = machineList.value[0].id
    }
    machineChange()
  }
  watch(selectMachineId, (val) => {
    if (!val) {
      machineId.value = ""
    } else {
      machineId.value = val
    }
  })
  getList()
  const machineId = ref("")
  function machineChange() {
    let obj = {}
    for (const item of machineList.value) {
      if (item.id === machineId.value) {
        obj = item
        break
      }
    }
    emit("selectedItem", obj)
  }
</script>
<template>
  <el-select
    v-model="machineId"
    filterable
    :clearable="isClear"
    placeholder="请选择"
    @change="machineChange"
  >
    <el-option v-for="item in machineList" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>
