<script lang="ts" setup>
  import request from "../common/request"

  async function changeCrane() {
    const p = {
      name: "8#",
    }
    await request.post("machine/moveCrane", p)
  }
  // changeCrane()
</script>
<template>
  <div style="display: flex; justify-content: center">
    <el-alert
      style="width: 60%; margin-top: 10%"
      title="未获取到用户信息"
      type="error"
      effect="dark"
    />
  </div>
</template>

<style></style>
