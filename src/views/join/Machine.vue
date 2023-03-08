<script setup lang="ts">
  import { ref, onMounted, watch, reactive } from "vue"
  import _ from "lodash-es"
  import request from "@/common/request"
  import { getCategorysByMouldDetail, getPersonList, role } from "@/common/common"
  import { useRoute } from "vue-router"
  import dayjs from "dayjs"
  import { ElMessage, ElMessageBox } from "element-plus"
  import { QuestionFilled } from "@element-plus/icons-vue"
  const route = useRoute()

  interface BoxDate {
    no: string
    name: string
    bgcolor: string
    currentType: string
    machineId: string
    selected: boolean
    caozuo: string
    caozuoName: string
    jiagong: string
    jiagongName: string
    fenpeiId: string
    completeI: number
    totalI: number
    jz: string
    category: string
  }
  const boxData = ref<BoxDate[]>([])
  for (let i = 1; i <= 18 * 6; i++) {
    let tempNo = ""
    if (i <= 18 * 1) {
      tempNo = "1-" + i
    } else if (i <= 18 * 2) {
      tempNo = "2-" + (i - 18)
    } else if (i <= 18 * 3) {
      tempNo = "3-" + (i - 18 * 2)
    } else if (i <= 18 * 4) {
      tempNo = "4-" + (i - 18 * 3)
    } else if (i <= 18 * 5) {
      tempNo = "5-" + (i - 18 * 4)
    } else if (i <= 18 * 6) {
      tempNo = "6-" + (i - 18 * 5)
    }
    boxData.value.push({
      no: tempNo,
      name: "",
      bgcolor: "white",
      currentType: "",
      machineId: "",
      selected: false,
      caozuo: "",
      caozuoName: "",
      jiagong: "",
      jiagongName: "",
      fenpeiId: "",
      completeI: 0,
      totalI: 0,
      jz: "",
      category: "",
    })
  }
  const selectColor = "#b3e19d"
  let fenbeiListByMachineId: any = {}
  async function getFenpeiList() {
    const res: any = await request.post("work/selectWorkFenPei")
    fenbeiListByMachineId = _.keyBy(res.list, "machineId")
  }
  let machineListByLocation: any = {}
  async function getDeviceArr() {
    const p = {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    }
    const res: any = await request.post("machine/selectBaseInfo", p)
    await getFenpeiList()
    machineListByLocation = _.keyBy(res.list, "location")
    for (const itemB of boxData.value) {
      const machineBL = machineListByLocation[itemB.no]
      // 被分配了物理位置并且机床当前有状态的情况下才分配
      if (machineBL && machineBL.status) {
        machineBL.showCategorys = getCategorysByMouldDetail(machineBL.mould_detail)
        itemB.machineId = machineBL.id
        const fenpeiBM = fenbeiListByMachineId[itemB.machineId]
        itemB.name = machineBL.name
        itemB.bgcolor = machineBL.color
        itemB.currentType = machineBL.isError ? machineBL.statusName : ""
        itemB.caozuo = fenpeiBM.caoZuo
        itemB.caozuoName = itemB.caozuo === "" ? "无人" : fenpeiBM.caozuoName
        itemB.jiagong = fenpeiBM.jiaGong
        itemB.jiagongName = fenpeiBM.jiagongName
        itemB.fenpeiId = fenpeiBM.id
        itemB.completeI = machineBL.count
        itemB.totalI = machineBL.quantity
        itemB.jz = machineBL.machine_Name
        itemB.category = machineBL.showCategorys
      } else {
        itemB.machineId = ""
        itemB.name = ""
        itemB.bgcolor = "white"
      }
      itemB.selected = false
    }
  }
  getDeviceArr()
  const personType = ref(1)
  const fenpeiIds = ref([])
  function selectedM(val) {
    for (const item of boxData.value) {
      if (item.no === val) {
        item.selected = true
        item.bgcolor = "#2196f3"
        fenpeiIds.value.push(item.fenpeiId)
        break
      }
    }
  }
  function deleteM(val) {
    for (const item of boxData.value) {
      if (item.no === val) {
        item.selected = false
        item.bgcolor = machineListByLocation[val].color
        _.pull(fenpeiIds.value, item.fenpeiId)
        break
      }
    }
  }
  const dialogVisible = ref(false)
  const titleDV = ref("")
  let replaceflag = false
  const personD = ref([])
  const personId = ref("")
  let distributePersonArr: any = []
  function doSelectedPersonF() {
    let tempResult = []
    if (personType.value === 1) {
      // 操作
      tempResult = _.filter(distributePersonArr, { key: role.caozuo })
    } else {
      // 加工
      tempResult = _.filter(distributePersonArr, { key: role.jiagong })
    }
    personD.value = _.filter(tempResult[0].value, { isComing: 1 })
    personId.value = personD.value[0].account
  }
  function getDistributePerson() {
    doSelectedPersonF()
    titleDV.value = "人员选择"
    replaceflag = false
    dialogVisible.value = true
  }
  async function fenpeiPerson() {
    const userClass = route.query.class
      ? route.query.class
      : JSON.parse(sessionStorage.getItem("currentUser")).class

    const p = {
      personId: personId.value,
      id: JSON.stringify(fenpeiIds.value),
      type: personType.value,
      banZu: userClass,
    }
    await request.post("work/updateWorkFenPei", p)
  }
  async function replaceSubmit() {
    const p = {
      oldPersonId: oldPersonId,
      newPersonId: personId.value,
      role: personType.value,
    }
    await request.post("work/replacePerson", p)
  }
  async function submit() {
    if (replaceflag) {
      await replaceSubmit()
    } else {
      await fenpeiPerson()
    }
    // 成功后 清除 fenpeiIds
    fenpeiIds.value = []
    getDeviceArr()
    dialogVisible.value = false
    ElMessage({
      type: "success",
      message: "操作成功!",
    })
  }
  function changeType() {
    // 清空已经选择的机床
    fenpeiIds.value = []
    for (const item of boxData.value) {
      if (item.machineId) {
        item.selected = false
        // item.bgcolor = selectColor
      }
    }
  }
  let oldPersonId = ""
  function replaceF(val) {
    oldPersonId = personType.value === 1 ? val.caozuo : val.jiagong
    doSelectedPersonF()
    titleDV.value = "人员替换"
    replaceflag = true
    dialogVisible.value = true
  }
  function clearPerson() {
    ElMessageBox.confirm("确认清空所选人员吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        personId.value = ""
        await fenpeiPerson()
        getDeviceArr()
        ElMessage({
          type: "success",
          message: "操作成功!",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  const loading = ref(false)
  onMounted(async () => {
    const className = route.query.class ? route.query.class : ""
    const token = route.query.token ? route.query.token : ""
    distributePersonArr = await getPersonList(token, className)
    setInterval(() => {
      // 在 08:00-08:01 和 20:00-20:01 之间同步临时分配表信息到机床正式表 替换操作和加工人员
      const tempTime = dayjs().format("HH:mm:ss")
      if (
        (tempTime >= "07:59:00" && tempTime <= "08:01:00") ||
        (tempTime >= "19:59:00" && tempTime <= "20:01:00")
      ) {
        loading.value = true
      } else {
        loading.value = false
      }
    }, 1000)
    pageStyle.out = route.query.class ? "margin: 8px" : "margin: 0px"
    pageStyle.head = route.query.class ? "margin-top: 0px" : "margin-top: -10px"
  })
  watch(loading, (val) => {
    // 如果临时分配同步结束则重新调用接口渲染界面
    if (!val) {
      getDeviceArr()
    }
  })
  const pageStyle = reactive({
    out: "margin: 8px",
    head: "margin-top: -10px",
  })
  function tempToCurrent() {
    ElMessageBox.confirm("确定要把人员同步到正式机床吗", "更换人员", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      await request.post("work/updateMechineBaseInfo")
      getDeviceArr()
      ElMessage({
        message: "更换成功",
        type: "success",
      })
    })
  }
</script>
<template>
  <div
    :style="pageStyle.out"
    style="min-width: 1700px"
    v-loading="loading"
    element-loading-text="7:59-8:01和19:59-20:01为机床人员同步时间，期间不可操作"
  >
    <div :style="pageStyle.head" style="margin-bottom: 8px; display: flex"
      ><div style="font-size: 18px">人员分配</div>
      <div style="margin-left: 20px; margin-top: 0px"
        ><span>人员类型：</span
        ><el-radio-group v-model="personType" @change="changeType">
          <el-radio :label="1">操作担当</el-radio>
          <el-radio :label="2">加工担当</el-radio>
        </el-radio-group></div
      >
      <el-button
        :disabled="fenpeiIds.length === 0"
        @click="getDistributePerson"
        type="primary"
        style="margin-left: 20px"
        >分配</el-button
      >
      <el-button
        :disabled="fenpeiIds.length === 0"
        @click="clearPerson"
        type="danger"
        style="margin-left: 20px"
        >清除</el-button
      >
      <el-button @click="tempToCurrent" type="primary" style="margin-left: 20px"
        >更换人员到正式机床</el-button
      >
      <div style="display: flex; margin-left: 10px; align-items: center">
        <el-icon :size="20" color="#409EFF">
          <QuestionFilled />
        </el-icon>
        <span style="color: #409eff; font-size: 14px"
          >每天7:59-8:01和19:59-20:01自动同步机床临时人员到正式机床中,期间不可操作</span
        >
      </div>
    </div>
    <div
      style="height: calc(100vh - 128px); display: flex; justify-content: center; flex-wrap: wrap"
    >
      <div
        class="box"
        :style="{ backgroundColor: item.bgcolor }"
        v-for="item in boxData"
        :key="item.no"
        ><div
          style="
            display: flex;
            justify-content: center;
            padding-top: 6px;
            flex-direction: column;
            align-items: center;
          "
          ><div>{{ item.name }}</div>
          <div style="font-size: 14px; display: flex; flex-direction: column; align-items: center">
            <div>
              {{ item.currentType }}
            </div>
            <div>
              {{ item.jz }}
            </div>
            <div style="font-size: 12px">
              {{ item.category }}
            </div>
            <div v-if="item.totalI"> {{ item.completeI }}/{{ item.totalI }} </div>
          </div>
          <div
            v-if="item.caozuoName || item.jiagongName"
            style="
              font-weight: bold;
              padding: 0px 4px;
              border: 1px solid white;
              font-size: 14px;
              margin-top: 2px;
            "
          >
            <div v-if="personType === 1">{{ item.caozuoName }}</div
            ><div v-else>{{ item.jiagongName }}</div>
          </div>
          <div
            v-if="item.name"
            class="oprateBtn"
            style="text-align: center; position: absolute; top: 76px"
          >
            <el-button
              v-if="!item.selected"
              @click="selectedM(item.no)"
              type="success"
              size="small"
              plain
              >选择</el-button
            ><el-button
              v-else
              @click="deleteM(item.no)"
              type="danger"
              size="small"
              plain
              style="margin-left: 0px"
              >删除</el-button
            >
            <el-button
              v-if="(personType === 1 && item.caozuo) || (personType === 2 && item.jiagong)"
              @click="replaceF(item)"
              type="warning"
              size="small"
              plain
              style="margin-left: 0px; margin-top: 2px"
              >替换</el-button
            >
          </div></div
        ></div
      >
    </div>
    <aside>
      <el-dialog v-model="dialogVisible" :title="titleDV" center width="400px">
        <el-select
          v-model="personId"
          filterable
          placeholder="Select"
          style="margin: 0 auto; display: block; width: 80%"
        >
          <el-option
            v-for="item in personD"
            :key="item.account"
            :label="item.name"
            :value="item.account"
          />
        </el-select>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </aside>
  </div>
</template>
<style lang="less" scoped>
  .box {
    width: 5.2%;
    height: 130px;
    margin: 2px;
    border: 1px solid #67c23a;
    position: relative;
    color: white;
  }
  .box:hover .oprateBtn {
    display: block;
  }
  .oprateBtn {
    display: none;
  }
</style>
