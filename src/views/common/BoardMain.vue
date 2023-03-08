<script lang="ts" setup>
  import dayjs from "dayjs"
  import { ref, toRefs } from "vue"
  const props = defineProps({
    title: {
      type: String,
      default: "",
    },
  })
  const { title } = toRefs(props)
  const currentTime = ref("")

  function showDate() {
    const weekT = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    currentTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss") + " " + weekT[dayjs().day()]
    setInterval(() => {
      currentTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss") + " " + weekT[dayjs().day()]
    }, 1000)
  }
  showDate()
</script>
<template>
  <div class="backAll">
    <header
      style="
        display: flex;
        justify-content: space-between;
        padding-bottom: 4px;
        border-bottom: 1px solid white;
      "
    >
      <div style="display: flex; align-items: center">
        <img src="../../../public/img/logo.png" alt="" style="width: 50px" />
        <div>
          <div>CHPAVC</div>
          <div>成形课稼动管理系统</div>
        </div>
      </div>
      <div style="position: absolute; margin-left: 220px">
        <slot name="left"></slot>
      </div>
      <div class="head-title">{{ title }}</div>
      <div style="margin-top: 25px">
        <div>{{ currentTime }}</div>
      </div>
    </header>
    <main style="height: calc(100vh - 70px)">
      <slot name="context"></slot>
    </main>
  </div>
</template>

<style lang="less" scoped>
  .backAll {
    min-width: 1400px;
    // background: url(../../../public/img/bg.jpg) no-repeat;
    // background-color: #106ebe;
    background-color: #2c3b66;
    background-size: cover;
    overflow: hidden;
    height: 100vh;
    position: relative;
    color: white;
    padding: 10px;
    box-sizing: border-box;
  }
  .head-title {
    text-align: center;
    margin-top: 6px;
    font-size: 26px;
    text-shadow: #5b8bb6 0 0 10px;
    color: white;
    letter-spacing: 12px;
  }
</style>
