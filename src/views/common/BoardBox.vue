<script setup lang="ts">
  import { toRefs } from "vue"
  const props = defineProps({
    title: {
      type: String,
      default: "",
    },
  })
  const emit = defineEmits(["titleClick"])
  const { title } = toRefs(props)
  function titleClick() {
    emit("titleClick")
  }
</script>
<template>
  <div class="box" style="height: 100%; width: 100%">
    <div style="display: flex; align-items: center; justify-content: space-between">
      <div class="box-title" @click="titleClick"> {{ title }}</div>
      <div style="">
        <slot name="right"></slot>
      </div>
    </div>
    <div style="height: calc(100% - 15px)"><slot></slot> </div>
  </div>
</template>
<style lang="less" scoped>
  .box {
    border: 1px solid #a4d2e6;
    box-sizing: border-box;
    padding: 10px;
    .box-title {
      margin-left: 2px;
      color: #83c7e3;
      font-size: 20px;
    }
  }
</style>
