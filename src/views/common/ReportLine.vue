<script lang="ts" setup>
  import dayjs from "dayjs"
  import { toRefs, onMounted, ref, reactive, watch } from "vue"
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
    queryDate: {
      type: String,
      default: "",
    },
    qinwu: {
      type: String,
      default: "",
    },
    lineWidth: {
      type: Number,
      default: 600,
    },
  })
  const { list, queryDate, qinwu, lineWidth } = toRefs(props)
  const lineTime = reactive({
    startDate: "",
    endDate: "",
  })

  interface StatusL {
    left: number
    width: number
    color: string
    name: string
  }
  const showStatusLine = ref<StatusL[]>([])
  const secondWidth = lineWidth.value / 12 / 60 / 60
  watch(
    list,
    (val) => {
      if (val.length === 0) {
        return
      }
      // 处理时间
      if (qinwu.value === "D勤") {
        lineTime.startDate = queryDate.value + " 08:00:00"
        lineTime.endDate = queryDate.value + " 20:00:00"
      } else {
        lineTime.startDate = queryDate.value + " 20:00:00"
        lineTime.endDate = dayjs(queryDate.value).add(1, "d").format("YYYY-MM-DD") + " 08:00:00"
      }
      showStatusLine.value = []
      for (const item of val) {
        // 开始时间小于查询勤务开始时间 开始时间 = 查询勤务开始时间
        item.startTime = item.startTime < lineTime.startDate ? lineTime.startDate : item.startTime
        //  没有结束时间 结束时间 = 当前时间
        if (!item.endTime) {
          item.endTime = dayjs().format("YYYY-MM-DD HH:mm:ss")
        }
        // 结束时间大于查询勤务 束时间 = 查询勤务结束时间
        if (item.endTime > lineTime.endDate) {
          item.endTime = lineTime.endDate
        }
        const left = (dayjs(item.startTime).unix() - dayjs(lineTime.startDate).unix()) * secondWidth
        const width = (dayjs(item.endTime).unix() - dayjs(item.startTime).unix()) * secondWidth
        showStatusLine.value.push({
          left: left,
          width: width,
          color: item.colorCode,
          name: `${item.status}(${item.startTime.substr(-8)}-${item.endTime.substr(-8)})`,
        })
      }
    },
    {
      immediate: true,
    }
  )
  onMounted(() => {})
</script>
<template>
  <div style="display: flex; justify-content: center">
    <div
      :style="{ width: lineWidth + 'px' }"
      style="
        margin: 0px 5px;
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
    </div>
  </div>
</template>
<style lang="less"></style>
