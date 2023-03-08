<script lang="ts" setup>
  import dayjs from "dayjs"
  import { toRefs, onMounted, ref, reactive, watch } from "vue"
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    queryTime: {
      type: String,
      default: "",
    },
  })
  const { list, queryTime } = toRefs(props)
  const showTime = queryTime.value || dayjs().format("YYYY-MM-DD HH:mm:ss")
  const showTimeH = Number(dayjs(showTime).format("H"))
  const lineTime = reactive({
    startTime: "",
    endTime: "",
    timeArea: [""],
    startDate: "",
  })
  if (showTimeH >= 8 && showTimeH < 20) {
    lineTime.startTime = "8:00"
    lineTime.endTime = "20:00"
    lineTime.timeArea = ["10:00", "12:00", "14:00", "16:00", "18:00"]
  } else {
    lineTime.startTime = "20:00"
    lineTime.endTime = "8:00"
    lineTime.timeArea = ["22:00", "0:00", "2:00", "4:00", "6:00"]
  }
  //小时< 8 则开始时间是前一天
  lineTime.startDate =
    showTimeH < 8
      ? dayjs().subtract(1, "d").format("YYYY-MM-DD") + " 20:00:00"
      : dayjs().format("YYYY-MM-DD") + " 08:00:00"

  interface StatusL {
    left: number
    width: number
    color: string
    name: string
  }
  const showStatusLine = ref<StatusL[]>([])
  const secondWidth = 100 / 60 / 60
  watch(list, (val) => {
    if (val.length === 0) {
      return
    }
    showStatusLine.value = []

    for (const item of val) {
      const left = (dayjs(item.startTime).unix() - dayjs(lineTime.startDate).unix()) * secondWidth
      const width = (dayjs(item.endTime).unix() - dayjs(item.startTime).unix()) * secondWidth
      showStatusLine.value.push({
        left: left,
        width: width,
        color: item.colorCode,
        name: `${item.status}(${item.startTime.substr(-8)}-${item.endTime.substr(-8)})`,
      })
    }
  })
  onMounted(() => {})
</script>
<template>
  <div style="display: flex; justify-content: center">
    <div>{{ lineTime.startTime }}</div>
    <div
      style="
        margin: 0px 5px;
        width: 1200px;
        border-radius: 4px;
        height: 20px;
        background-color: #2196f380;
        position: relative;
      "
    >
      <el-tooltip
        effect="light"
        v-for="item in showStatusLine"
        :key="item.left"
        :content="item.name"
        placement="top"
      >
        <div
          style="
            position: absolute;
            height: 20px;
            border-right: 1px solid white;
            box-sizing: border-box;
          "
          :style="{ left: item.left + 'px', width: item.width + 'px', backgroundColor: item.color }"
        >
        </div>
      </el-tooltip>
      <div class="tt">
        <div
          :style="{ left: 200 * (index + 1) - 20 + 'px' }"
          style="position: absolute; margin-top: 15px"
          v-for="(item, index) in lineTime.timeArea"
          :key="item"
          >{{ item }}</div
        >
      </div>
    </div>
    <div>{{ lineTime.endTime }}</div>
  </div>
</template>
<style lang="less" scoped>
  .tt {
    background-image: linear-gradient(90deg, white 2px, transparent 0);
    background-size: 100px 100px;
    position: absolute;
    width: 100%;
    height: 10px;
    border-bottom: 1px solid white;
    margin-top: 25px;
    border-right: 1px solid white;
    display: flex;
    position: relative;
  }
</style>
