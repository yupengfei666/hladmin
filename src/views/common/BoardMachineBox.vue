<script setup lang="ts">
  import { toRefs } from "vue"
  import { useRouter } from "vue-router"

  const router = useRouter()
  const props = defineProps({
    machine: {
      type: Object,
      default: () => {},
    },
  })
  const { machine } = toRefs(props)
  function goDetail(val) {
    router.push({
      path: "/board/devicedetail",
      query: {
        id: val,
      },
    })
  }
</script>
<template>
  <div
    class="device-card"
    :style="{ backgroundColor: machine.color }"
    @click="goDetail(machine.id)"
  >
    <div
      style="
        position: absolute;
        right: 0px;
        color: yellow;
        margin-right: 2px;
        margin-top: 2px;
        top: 0px;
        font-size: 12px;
        border: 1px solid yellow;
        padding: 0px 2px;
      "
    >
      {{ machine.tons }}
    </div>
    <div>
      <span class="name">{{ machine.name }}</span>
      <span class="type">{{ machine.type }}</span>
    </div>
    <div class="tj" style="">
      <div style="display: flex; justify-content: space-between; width: 100%; height: 18px">
        <div>{{ machine.jz }}</div>
        <div>{{ machine.jzName }}</div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div v-if="machine.totalI > 0">{{ machine.completeI }}/{{ machine.totalI }}</div>
        <div>稼：{{ machine.jdl }} %</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  @media (min-width: 2000px) {
    .device-card {
      width: 200px;
      height: 100px;
      .name {
        font-size: 26px;
      }
      .tj {
        font-size: 16px;
      }
      .type {
        font-size: 20px;
      }
    }
  }
  @media (max-width: 2000px) {
    .device-card {
      width: 140px;
      height: 78px;
      .name {
        font-size: 20px;
      }
      .tj {
        font-size: 12px;
      }
      .type {
        font-size: 16px;
      }
    }
  }
  .device-card {
    display: inline-block;
    position: relative;
    margin: 5px;
    padding: 2px;
    cursor: pointer;
    // box-shadow: 0px 0px 5px white;
    // box-sizing: border-box;
    .name {
      font-weight: bold;
    }
    .tj {
      padding-top: 8px;
    }
    .type {
      margin-left: 6px;
    }
  }
</style>
