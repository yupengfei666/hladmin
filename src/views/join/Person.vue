<script setup lang="ts">
  import { ref, reactive, onMounted } from "vue"
  import { ElMessage } from "element-plus"
  import request from "@/common/request"
  import { getPersonList } from "@/common/common"
  import { useRoute } from "vue-router"
  const route = useRoute()
  const person = ref([])
  const mainTop = ref("-10px")
  const mainPadding = ref("0px 0px")
  onMounted(async () => {
    const token = route.query.token ? route.query.token : ""
    const className = route.query.class ? route.query.class : ""
    person.value = await getPersonList(token, className)
    mainTop.value = route.query.token ? "8px" : "-10px"
    mainPadding.value = route.query.token ? "0px 8px" : "0px 0px"
  })
  async function changeComing(val) {
    const p = {
      account: val.account,
      isComing: val.isComing === 1 ? 0 : 1,
    }
    await request.post("RiJia/changePersonDgzt", p)
    const token = route.query.token ? route.query.token : ""
    const className = route.query.class ? route.query.class : ""
    person.value = await getPersonList(token, className)

    ElMessage({
      type: "success",
      message: "操作成功!",
    })
  }
</script>
<template>
  <div :style="{ padding: mainPadding }">
    <div
      :style="{ marginTop: mainTop }"
      style="margin-bottom: 8px; display: flex; align-items: center"
    >
      <div style="display: flex; align-items: center">
        <div style="width: 20px; height: 20px; background-color: #2ad43173"></div>
        <div style="margin-left: 10px">到岗</div>
        <div
          style="width: 20px; height: 20px; background-color: lightgray; margin-left: 20px"
        ></div>
        <div style="margin-left: 10px">未到岗</div>
      </div>
    </div>
    <el-card v-for="itemT in person" :key="itemT.key" style="margin-bottom: 8px">
      <template #header>
        <div class="card-header">
          <span>{{ itemT.key }}</span>
        </div>
      </template>
      <div style="display: flex; flex-wrap: wrap"
        ><el-card
          class="personBox"
          :style="{ backgroundColor: item.isComing ? '#2ad43173' : 'lightgray' }"
          v-for="item in itemT.value"
          :key="item.id"
          @click="changeComing(item)"
        >
          <div style="display: flex; flex-direction: column; align-items: center"
            ><div> {{ item.name }} </div> <div style="margin-top: 10px"> {{ item.gh }}</div></div
          >
        </el-card>
      </div>
    </el-card>
  </div>
</template>
<style lang="less" scoped>
  .personBox {
    width: 100px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
  }
</style>
