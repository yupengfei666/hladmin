<script setup lang="ts">
  import { RouterView } from "vue-router"
  import { ref } from "vue"
  // 是否展示左侧菜单
  const showMenu = ref(true)
  const contentWidth = showMenu.value ? "calc(100vw - 180px)" : "100vw"
  const rightWidth = ref(contentWidth)
</script>

<template>
  <main style="width: 100vw; height: 100vh; display: flex">
    <div v-if="showMenu" style="width: 180px; height: 100vh">
      <el-menu
        style="height: 100%"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        :router="true"
      >
        <el-sub-menu index="1">
          <template #title>
            <span>设备管理</span>
          </template>
          <el-menu-item route="/machine/baseinfo" index="/machine/baseinfo">
            <span>设备信息</span>
          </el-menu-item>
          <el-menu-item route="/machine/historystatus" index="/machine/historystatus">
            <span>历史记录</span>
          </el-menu-item>
          <el-menu-item route="/machine/nextplans" index="/machine/nextplans">
            <span>生产计划变更</span>
          </el-menu-item>
          <el-menu-item route="/machine/asset" index="/machine/asset">
            <span>资产管理</span>
          </el-menu-item>
          <el-menu-item route="/machine/status" index="/machine/status">
            <span>状态定义管理</span>
          </el-menu-item>
          <el-menu-item route="/machine/location" index="/machine/location">
            <span>物理位置维护</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <span>报工管理</span>
          </template>
          <el-menu-item route="/report/reportworknew" index="/report/reportworknew">
            <span>作业日报</span>
          </el-menu-item>
          <el-menu-item route="/report/reportapprove" index="/report/reportapprove">
            <span>报工审批</span>
          </el-menu-item>
          <el-menu-item route="/report/badproducttype" index="/report/badproducttype">
            <span>不良品类型</span>
          </el-menu-item>
          <el-menu-item route="/report/badProductgl" index="/report/badProductgl">
            <span>不良品管理</span>
          </el-menu-item>
          <el-menu-item route="" index="">
            <span>状况管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
          <template #title>
            <span>点检管理</span>
          </template>
          <el-menu-item route="/check/check" index="/check/check">
            <span>点检管理</span>
          </el-menu-item>
          <el-menu-item route="/check/padcheck" index="/check/padcheck">
            <span>Pad点检</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="6">
          <template #title>
            <span>智能吊车</span>
          </template>
          <el-menu-item route="/crane/check" index="/crane/check">
            <span>点检管理</span>
          </el-menu-item>
          <el-menu-item route="/crane/repair" index="/crane/repair">
            <span>维修管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title> <span>看板管理</span> </template>
          <el-menu-item route="/board/alldevice" index="/board/alldevice">
            <span>设备总览</span>
          </el-menu-item>
          <el-menu-item route="/board/devicenenghao" index="/board/devicenenghao">
            <span>能耗总览</span>
          </el-menu-item>
          <!-- <el-menu-item route="/board/devicedetail" index="/board/devicedetail">
            <span>设备详情</span>
          </el-menu-item> -->
          <el-menu-item route="/board/waste" index="/board/waste">
            <span>废料总览</span>
          </el-menu-item>
          <el-menu-item route="/board/check" index="/board/check">
            <span>机床点检看板</span>
          </el-menu-item>
          <el-menu-item route="/board/cranecheck" index="/board/cranecheck">
            <span>吊车点检看板</span>
          </el-menu-item>
          <el-menu-item route="/board/machinebyperson" index="/board/machinebyperson">
            <span>机床分布</span>
          </el-menu-item>
          <el-menu-item route="/board/machinebymonth" index="/board/machinebymonth">
            <span>机床按月展示</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item route="/file/file" index="/file/file">
          <span>文档管理</span>
        </el-menu-item>
        <el-menu-item route="/join" index="/join">
          <span>交接管理</span>
        </el-menu-item>
        <el-menu-item route="/user" index="/user">
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div :style="{ width: rightWidth }" style="height: 100vh">
      <RouterView />
    </div>
  </main>
</template>

<style>
  body {
    margin: 0px;
  }
  .el-sub-menu .el-menu-item {
    min-width: 180px !important;
  }
</style>
