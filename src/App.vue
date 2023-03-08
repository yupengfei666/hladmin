<!--
 * @Author: zhangchen
 * @Date: 2022-11-09 09:32:57
 * @LastEditTime: 2022-12-02 16:34:44
-->
<script setup lang="ts">
  import { RouterView, useRoute, useRouter } from "vue-router"
  import { onMounted, ref } from "vue"
  import dayjs from "dayjs"
  import { replacePersonToProdue, getPersonList } from "@/common/common"

  import request from "@/common/request"
  import Cookies from "js-cookie"
  const route = useRoute()
  const router = useRouter()
  // 1班班长 王小二 22037
  Cookies.set(
    "com.rja.up.mes.auth.cookie.token",
    "eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAFWNQQ7CIBBF7zJr0zBToI0n0EVdeQEGhqSaggmwMt7dWeryv__y_xtCjHWUDmcgMvMCJ9iDJvR-dQatIwWtaT1e0yFtivVQ59F3RYHmkNFLIrIWMzMt7Fxek0QTCFHFwvl_rA3--er1KWWrSZTdL9cbfL6w81ngkgAAAA.gceSlrTb1fdSKli5W2TgwExqQza8boTuw5Er9V16o9k"
  )
  // 2班班长 王小五 22038
  // Cookies.set(
  //   "com.rja.up.mes.auth.cookie.token",
  //   "eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAFWNMQ7CMBAE_3I1ipy72D7zAiig4gPJYUsBxY5ku0L8naODcmdXsy-YRUrPDY6AaIjhAOusaXQegzFErKBWrfs-bLEOUjbdPNqqKDpkYiOCgSYzJvbRT945STZYtl9ZXtK_rPbl56uVZ8yXco_KbqfzFd4f_frTL5IAAAA.rLehUefpz6imYPBnfgeZOe8WO80qktvC3LjDfJzvXVQ"
  //   // "eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAFWNMQ7CMBAE_3I1iu7iS4x5ARSk4gPO2ZYCio1ku0L5O1dCubOj3Q94kdJzgwuMIxoLJ9i8JprtxEh2dgpq1bq_hz3WQcquzrNtivhM4kIiEUKeHHqOiI4DGzSUglcxr-l_rPb156uVV8z3EqKyx_W2wPEFDfBP35IAAAA._nUD0X-4KCGTGl4nTwPGazGT0kBf3O6KFXkLZ6jF2P8"
  // )

  // 1班操作 路飞2 22034
  // Cookies.set(
  //   "com.rja.up.mes.auth.cookie.token",
  //   "eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAFWNsQ7CMAxE_8UzqlrXNQlfAANM_EDiuFJBTZCSTIh_xyNsd-9Od28IIqXnBidAHGeCA2zB3MTsPaHjo4FaLe6vYdc6SNmt82ibIUVWcSEt40rkTUZKOgmr85iWOVoxx_V_rPb489XKU_O1JDV2P19u8PkCWeyuW5IAAAA.qs5o_eKVxfZAJ6Skge42pJPo2zdDtRVR_z1a-69pg0k"
  // )

  // 2班操作 张三丰2 22033
  // Cookies.set(
  //   "com.rja.up.mes.auth.cookie.token",
  //   "eyJhbGciOiJIUzI1NiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAFWNsQ7CMAxE_8UzqhInwhFfAANM_ICdulJBTZCSTIh_r8eynHTvTndf4JzrKB0ugOhCgBOsbM6fiSg6IwZas3h8pk3blOtmnVdfDYlwyot6Rq_RUeCIswpxQpcwy2LFYvo31oYcvnp9a7nXWY09r7cH_Hb1rQ5OkgAAAA.n5BmtVNRBcjsLdnjsHkv77YLeBhfGw9xy-pw5IdN1n8"
  // )

  // 获取app传来的token
  const urlS = window.location.href.split("?")
  let urlToken = ""
  if (urlS.length > 1) {
    const urlP = urlS[1].split("&")
    for (const item of urlP) {
      const kv = item.split("=")
      if (kv[0] === "token") {
        urlToken = kv[1]
        break
      }
    }
  }
  const cookieToken = Cookies.get("com.rja.up.mes.auth.cookie.token") || urlToken
  const loading = ref(true)
  if (cookieToken) {
    sessionStorage.setItem("token", cookieToken)
  } else {
    // 提示未获取到用户信息
    router.push("/nouser")
    loading.value = false
  }
  const uToken = sessionStorage.getItem("token")
  async function saveUserInfo() {
    if (!uToken) {
      return
    }
    const p = {
      token: uToken,
    }
    const res: any = await request.post("RiJia/SelectCurrentOne", p)
    const user = {
      account: res.account,
      name: res.name,
      role: res.roleNames,
      class: res.className,
    }
    sessionStorage.setItem("currentUser", JSON.stringify(user))
    loading.value = false
    // 获取当前登录人班组成员信息/;
    getPersonList()
  }

  saveUserInfo()
  onMounted(() => {
    setInterval(() => {
      // 在 08:00-08:01 和 20:00-20:01 之间同步临时分配表信息到机床正式表 替换操作和加工人员
      const tempTime = dayjs().format("HH:mm:ss")
      if (
        (tempTime >= "08:00:00" && tempTime <= "08:01:00") ||
        (tempTime >= "20:00:00" && tempTime <= "20:01:00")
      ) {
        replacePersonToProdue()
      }
    }, 30 * 1000)
  })
</script>

<template>
  <div v-if="loading" v-loading="loading" style="height: 100vh"></div>
  <RouterView v-else />
</template>

<style></style>
