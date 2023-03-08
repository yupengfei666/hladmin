<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import { ElMessage, type FormInstance, type FormRules } from "element-plus"
  import request from "../../common/request"
  import { role } from "@/common/common"
  import MachineSelect from "../common/MachineSelect.vue"
  import dayjs from "dayjs"
  import { useRoute } from "vue-router"
  const route = useRoute()
  const queryNow = ref(false)

  onMounted(() => {
    queryNow.value = true
  })
  const userStorge = JSON.parse(sessionStorage.getItem("currentUser"))
  getBanzhang()
  const banzhang = ref("")
  async function getBanzhang() {
    const p = {
      token: sessionStorage.getItem("token"),
      className: userStorge.class,
    }
    const res: any = await request.post("RiJia/selectCurrentClass", p)
    for (const item of res.list) {
      if (item.roleName === role.banzhang) {
        banzhang.value = item.account
        break
      }
    }
    form.approver = banzhang.value
  }
  console.log(23)
  console.log(route.query.machineId)

  const form = reactive({
    ID: "",
    name: "",
    machineId: route.query.machineId,
    // 开发
    // machineId: "1efb7198-1fa4-4be5-b7be-e812fe230572",
    checkTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    fctzqr: "",
    aqmqr: "",
    pzdzqr: "",
    xpxzpsqr: "",
    xpxzcs: "",
    sbycyqr: "",
    jshmdkqr: "",
    dcqrjc: "",
    mjxqqj: "",
    mjsy: "", // 模具上油
    sgljqr: "",
    sprarone: "",
    sprartwo: "",
    sprarthree: "",
    zbsbyzqrone: "",
    zbsbyzqrtwo: "",
    zbsbyzqrthree: "",
    cxtjqr: "",
    wdjlclgz: "",
    wdjldm: "",
    wdjldingm: "",
    operator: userStorge.account,
    djddD: "",
    djdd: "",
    bzqrD: "",
    bzqrE: "",
    reportDate: "",
    qinwu: "",
    approver: "",
  })
  let apiUrl: string
  async function getCheck() {
    const currentH = dayjs().format("HH")
    if (currentH > "07") {
      form.reportDate = dayjs().format("YYYY-MM-DD")
    } else {
      form.reportDate = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
    if (currentH > "07" && currentH < "20") {
      form.qinwu = "D勤"
    } else {
      form.qinwu = "E勤"
    }
    const p = {
      machineId: form.machineId,
      reportDate: form.reportDate,
      qinwu: form.qinwu,
      pageIndex: 1,
      pageSize: 10,
    }
    const res: any = await request.post("/operate/selectCheck", p)
    console.log(res)
    if (res.total === 1) {
      Object.assign(form, res.list[0])
      apiUrl = "/operate/updateCheck"
    } else {
      apiUrl = "/operate/insertCheck"
    }
  }
  getCheck()
  const formRef = ref<FormInstance>()

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
      if (valid) {
        await request.post(apiUrl, form)
        ElMessage({
          type: "success",
          message: "点检成功!",
        })
      }
    })
  }
  const formRules = reactive<FormRules>({
    machineId: [{ required: true, message: "请选择机床", trigger: "blur" }],
    fctzqr: [{ required: true, message: "请选择", trigger: "blur" }],
    aqmqr: [{ required: true, message: "请选择", trigger: "blur" }],
    pzdzqr: [{ required: true, message: "请选择", trigger: "blur" }],
    xpxzpsqr: [{ required: true, message: "请选择", trigger: "blur" }],
    xpxzcs: [{ required: true, message: "请选择", trigger: "blur" }],
    sbycyqr: [{ required: true, message: "请选择", trigger: "blur" }],
    jshmdkqr: [{ required: true, message: "请选择", trigger: "blur" }],
    dcqrjc: [{ required: true, message: "请选择", trigger: "blur" }],
    mjxqqj: [{ required: true, message: "请选择", trigger: "blur" }],
    mjsy: [{ required: true, message: "请选择", trigger: "blur" }],
    sgljqr: [{ required: true, message: "请选择", trigger: "blur" }],
    sprarone: [{ required: true, message: "请选择", trigger: "blur" }],
    zbsbyzqrone: [{ required: true, message: "请选择", trigger: "blur" }],
    cxtjqr: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjlclgz: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjldm: [{ required: true, message: "请选择", trigger: "blur" }],
    wdjldingm: [{ required: true, message: "请选择", trigger: "blur" }],
  })
</script>

<template>
  <el-scrollbar>
    <div class="main">
      <el-form ref="formRef" :model="form" label-width="150px" :rules="formRules">
        <el-form-item label="机床号" prop="machineId">
          <MachineSelect
            :selected-first="false"
            class="content-width"
            :selectMachineId="form.machineId"
            disabled
          >
          </MachineSelect>
        </el-form-item>
        <el-form-item label="非常停止确认" prop="fctzqr">
          <el-radio-group v-model="form.fctzqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="安全门确认" prop="aqmqr">
          <el-radio-group v-model="form.aqmqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="喷嘴对正确认" prop="pzdzqr">
          <el-radio-group v-model="form.pzdzqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="吸盘吸嘴破碎确认" prop="xpxzpsqr">
          <el-radio-group v-model="form.xpxzpsqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="吸盘吸嘴擦拭" prop="xpxzcs">
          <el-radio-group v-model="form.xpxzcs" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备异常音确认" prop="sbycyqr">
          <el-radio-group v-model="form.sbycyqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="监视画面打开确认" prop="jshmdkqr">
          <el-radio-group v-model="form.jshmdkqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="顶出确认检查" prop="dcqrjc">
          <el-radio-group v-model="form.dcqrjc" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模具型腔清洁" prop="mjxqqj">
          <el-radio-group v-model="form.mjxqqj" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模具上油" prop="mjsy">
          <el-radio-group v-model="form.mjsy" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="水管连接确认" prop="sgljqr">
          <el-radio-group v-model="form.sgljqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <div style="border: 1px dashed rgb(181, 183, 189); width: 85%">
          <el-form-item label="SPRAR温度确认" style="margin-left: -1.8%"> </el-form-item>
          <el-form-item label="第一次" prop="sprarone">
            <el-radio-group v-model="form.sprarone" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="第二次">
            <el-radio-group v-model="form.sprartwo" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="第三次">
            <el-radio-group v-model="form.sprarthree" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </div>
        <div style="border: 1px dashed rgb(181, 183, 189); width: 85%; margin-top: 15px">
          <el-form-item label="周边设备运转确认" style="margin-left: -1%"> </el-form-item>
          <el-form-item label="第一次" prop="zbsbyzqrone">
            <el-radio-group v-model="form.zbsbyzqrone" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="第二次">
            <el-radio-group v-model="form.zbsbyzqrtwo" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="第三次">
            <el-radio-group v-model="form.zbsbyzqrthree" class="ml-4">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item label="成型条件确认" style="margin-top: 15px" prop="cxtjqr">
          <el-radio-group v-model="form.cxtjqr" class="ml-4">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <div style="border: 1px dashed rgb(181, 183, 189); width: 85%">
          <el-form-item label="温度记录" style="margin-left: -5.6%"> </el-form-item>
          <el-form-item label="材料干燥" prop="wdjlclgz">
            <el-input
              v-model="form.wdjlclgz"
              placeholder="请输入温度（℃）"
              clearable
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="动模" prop="wdjldm">
            <el-input
              v-model="form.wdjldm"
              placeholder="请输入温度（℃）"
              clearable
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="定模" prop="wdjldingm">
            <el-input
              v-model="form.wdjldingm"
              placeholder="请输入温度（℃）"
              clearable
              style="width: 250px"
            />
          </el-form-item>
        </div>

        <el-form-item>
          <el-button style="margin-top: 16px" type="primary" @click="submitForm(formRef)"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-scrollbar>
</template>
<style scoped>
  .main {
    padding: 5% 10%;
  }
  .content-width {
    width: calc(100% - 150px);
  }
</style>
