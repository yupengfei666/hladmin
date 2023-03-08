<script setup lang="ts">
  import { ref, onMounted } from "vue"
  import Person from "./Person.vue"
  import Machine from "./Machine.vue"
  import Quality from "./Quality.vue"
  import Work from "./Work.vue"

  const handleClick = (tab) => {
    console.log(tab)
  }
  console.log(13324)

  const user = JSON.parse(sessionStorage.getItem("currentUser"))

  console.log("user", user)
  const activeName = ref("")
  onMounted(() => {
    if (user.role == "机床操作员") {
      activeName.value = "4"
    } else {
      activeName.value = "1"
    }
  })
</script>
<template>
  <div style="padding: 10px">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <template v-if="user.role == '班长' || user.role == '交替'">
        <el-tab-pane label="人员确认" name="1" style="padding: 10px">
          <Person></Person>
        </el-tab-pane>
        <el-tab-pane label="设备分配" name="2" style="padding: 10px"
          ><Machine></Machine
        ></el-tab-pane>
        <el-tab-pane label="品质查看" name="3" style="padding: 10px"
          ><Quality></Quality
        ></el-tab-pane>
      </template>
      <template v-if="user.role !== '加工'">
        <el-tab-pane label="交班说明" name="4" style="padding: 10px"><Work></Work></el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>
