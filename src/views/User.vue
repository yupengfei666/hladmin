<script lang="ts" setup>
  import { useRouter } from "vue-router"
  import { ElMessage } from "element-plus"
  import { reactive, onMounted } from "vue"

  import request from "../common/request"

  const router = useRouter()
  let user = reactive({
    name: "",
    role: "",
    account: "",
    class: "",
  })
  if (sessionStorage.getItem("currentUser")) {
    user = JSON.parse(sessionStorage.getItem("currentUser") as string)
  }
  onMounted(() => {})

  //角色
  const userList = reactive([
    {
      name: "王小二",
      classes: "1班",
      role: "班长",
    },
    {
      name: "张三丰2",
      classes: "2班",
      role: "操作",
    },
    {
      name: "路飞2",
      classes: "1班",
      role: "操作",
    },
    {
      name: "王小五",
      classes: "2班",
      role: "班长",
    },
  ])

  async function saveUserInfo(token) {
    const p = {
      token: token,
    }
    const res: any = await request.post("RiJia/SelectCurrentOne", p)
    console.log(res)
    const user = {
      account: res.account,
      name: res.name,
      role: res.roleNames,
      class: res.className,
    }
    sessionStorage.setItem("currentUser", JSON.stringify(user))
    sessionStorage.setItem("token", token)
  }

  //登录
  async function loginWXR(data: any) {
    let account = ""
    let password = ""
    console.log("data", data)
    if (data.name == "王小二") {
      account = "22037"
      password = "123456"
    } else if (data.name == "张三丰2") {
      account = "22033"
      password = "123456"
    } else if (data.name == "路飞2") {
      account = "22034"
      password = "123456"
    } else {
      account = "22038"
      password = "123456"
    }

    await request
      .post("/RiJia/login", { account: account, password: password })
      .then(async (data: any) => {
        console.log("登录的返回值的token", data.token)

        await saveUserInfo(data.token)
        user = reactive(JSON.parse(sessionStorage.getItem("currentUser")))
        console.log("user登录之后", user)

        ElMessage({
          type: "success",
          message: "登录成功",
        })
        setTimeout(() => {
          router.go(0)
        }, 500)
      })
  }
</script>
<template>
  <div style="margin: 70px 120px"
    >当前账户：{{ user.name }}\{{ user.role }}\{{ user.account }}\{{ user.class }}</div
  >
  <div style="display: flex; flex-direction: row; align-items: center; padding-top: 40px">
    <div style="font-size: 22px; flex: 1; margin-left: 120px" v-for="item in userList">
      <div style="margin-top: 10px">员工名：{{ item.name }}</div>
      <div style="margin-top: 10px">班次：{{ item.classes }}</div>
      <div style="margin-top: 10px">角色：{{ item.role }}</div>

      <el-button type="primary" style="margin-top: 20px" @click="loginWXR(item)">登录</el-button>
    </div>
  </div>
</template>

<style></style>
