<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref, computed, watch } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { dayjs, ElMessage, type FormInstance, type FormRules } from "element-plus"
  import { ElMessageBox } from "element-plus"
  import request from "../../common/request"
  import JiadongDetail from "./JiadongDetail.vue"
  import MachineSelect from "../common/MachineSelect.vue"

  const formRef = ref<FormInstance>()
  const tableItem = [
    {
      prop: "name",
      label: "机床号",
      fixed: true,
    },
    // {
    //   prop: "affirm",
    //   label: "接班6S确认",
    // },
    {
      prop: "reportTime",
      label: "报工时间",
      width: 170,
    },

    {
      prop: "pinfan",
      label: "品番",
    },

    {
      prop: "number",
      label: "取数",
    },
    {
      prop: "jiepai",
      label: "节拍",
    },
    {
      prop: "output",
      label: "生产数量",
    },
    {
      prop: "badNumber",
      label: "不良数量",
    },
    {
      prop: "mojushangyou",
      label: "模具上油",
    },
    {
      prop: "qualityAffirm",
      label: "外观品质确认",
    },
    {
      prop: "operator",
      label: "上报人",
      width: 100,
    },
    {
      prop: "instructions",
      label: "交班说明",
    },
    {
      prop: "record",
      label: "交接班记录",
      width: "100px",
    },
    {
      prop: "yichangyuanyin",
      label: "异常原因",
    },
    // {
    //   prop: "jiadongRemark",
    //   label: "稼动标记",
    //   width: "100px",
    // },
    // {
    //   prop: "startTime",
    //   label: "稼动开始时间",
    //   width: "180px",
    // },
    // {
    //   prop: "endTime",
    //   label: "稼动结束时间",
    //   width: "180px",
    // },
    {
      prop: "classes",
      label: "班组",
    },
    {
      prop: "distinguish",
      label: "勤务区分",
    },
    // {
    //   prop: "operationTime",
    //   label: "操作时间",
    //   width: "180px",
    // },
    {
      prop: "approver",
      label: "审批人",
    },
    {
      prop: "approvalTime",
      label: "审批时间",
      width: "180px",
    },
    {
      prop: "approvalResult",
      label: "审批结果",
    },
  ]
  const queryParams = ref([])

  const queryNow = ref(false)
  const machineAll: any = reactive({
    list: [],
  })
  onMounted(async () => {
    queryNow.value = true

    queryParams.value = [
      {
        key: "machineId",
        value: "",
      },
    ]
    const result: any = await getMachineAll()
    machineAll.list = result.list
    console.log("machineAll.list", machineAll.list)

    getBadType()
  })
  const formHead = reactive({
    machineId: "",
  })
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    name: "",
    machineId: "",
    affirm: "",
    reportTime: "",
    pinfan: "",
    number: "",
    jiepai: "",
    output: "",
    mojushangyou: "",
    qualityAffirm: "",
    operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
    instructions: "",
    record: "",
    jiadongRemark: "",
    classes: "",
    distinguish: "",
    operationTime: "",
    approver: "",
    approvalTime: "",
    approvalResult: "",
    badNumber: "0",
    yichangyuanyin: "",
    badTypeIdCount: "",
  })
  const badType = reactive({
    list: [],
  })
  //这里是不良品类型相对应的数量  针对于编辑操作
  const badTypeNum = reactive({
    list: [],
  })
  //这里是不良品类型相对应的数量  针对于不良品维护按钮
  const badTypeNumButton = reactive({
    list: [],
  })

  //获取全部的不良类型
  async function getBadType() {
    const result: any = await request.post("/operate/selectBadPtype", {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    })

    badType.list = result.list
    console.log("badType", badType)
  }

  //const isbuttonvisiable = ref(false)
  const editbadnum = ref(false)
  const isshowadd = ref(true)
  async function openDrawer(data = "") {
    drawer.show = true
    console.log(data)
    if (data) {
      drawer.title = "编辑"
      // if (form.badNumber == "") {
      //   isshowadd.value = false
      //   editbadnum.value = true
      //   isbuttonvisiable.value = false
      // } else {
      //   isbuttonvisiable.value = true
      //   editbadnum.value = false
      //   isshowadd.value = true
      // }

      for (let i = 0; i < badType.list.length; i++) {
        let temp1: any = {}
        let id = badType.list[i].id

        temp1[id] = 0
        badTypeNum.list.push(temp1)
        temp1 = {}
      }

      await request
        .post("/operate/selectBadPHistoryCount", { reportId: data.id })
        .then((data: any) => {
          console.log("查询履历返回的接口", data)
          data.list.forEach((item1) => {
            badTypeNum.list.forEach((item) => {
              if (Object.keys(item)[0] == item1.badTypeId) {
                // console.log(" Object.keys(item)[0]", Object.keys(item)[0])
                //  console.log("item1.badTypeId", item1.badTypeId)
                //   console.log("item", item)

                item[item1.badTypeId] = item1.count
                console.log("匹配上")
              }
            })
            console.log("badTypeNum.list", badTypeNum.list)
          })
        })

      Object.assign(form, data)
    } else {
      drawer.title = "新增"
      isshowadd.value = false
      Object.assign(form, {
        name: "",
        affirm: "",
        machineId: "",
        reportTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        pinfan: "",
        number: "",
        jiepai: "",
        output: "",
        mojushangyou: "",
        qualityAffirm: "",
        operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
        instructions: "",
        record: "",
        jiadongRemark: "",
        yichangyuanyin: "",
        classes: "",
        distinguish: "",
        operationTime: "",
        approver: "",
        approvalTime: "",
        approvalResult: "",
        badNumber: 0,
        badTypeIdCount: "",
      })

      console.log("badType", badType)
      badTypeNum.list.length = 0
      for (let i = 0; i < badType.list.length; i++) {
        let temp1: any = {}
        let id = badType.list[i].id

        temp1[id] = 0
        badTypeNum.list.push(temp1)
        temp1 = {}
      }
      console.log("badTypeNum.list", badTypeNum.list)
    }
  }
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        let url = ""
        let tem: any = {
          badTypeIdCount: [],
        }
        let temp: any = []
        // console.log(" badTypeNum.list", badTypeNum.list)
        //  console.log("badType.list", badType.list)
        for (let i = 0; i < badType.list.length; i++) {
          temp.push({
            badTypeId: badType.list[i].id,
            count: Number(badTypeNum.list[i][badType.list[i].id]),
          })
        }

        //算总数的
        tem.badTypeIdCount = temp
        console.log("tem", tem)
        form.badTypeIdCount = JSON.stringify(tem)
        if (drawer.title == "新增") {
          //console.log("新增信息!")
          //  console.log("badType.list", badType.list)
          // console.log("badTypeNum.list", badTypeNum.list)
          console.log("form", form)
          isDorE(form.reportTime)
          //  console.log("form", form)
          url = "/operate/insertReport"
        } else {
          console.log("编辑!")

          url = "/operate/updateReport"
        }
        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)
          queryNow.value = true
          drawer.show = false
          ElMessage({
            type: "success",
            message: "操作成功!",
          })
        })
      }
    })
  }
  //报工时间的校验
  const validatePass1 = (rule: any, value: any, callback: any) => {
    console.log("value", value)

    if (value == null) {
      callback(new Error("请选择时间"))
    } else if (Date.parse(value) > Date.parse(new Date())) {
      callback(new Error("点检时间不应大于当前时间"))
    } else {
      callback()
    }
  }

  const formRules = reactive<FormRules>({
    machineId: [{ required: true, message: "请选择", trigger: "blur" }],
    reportTime: [{ validator: validatePass1, trigger: "blur" }],
    pinfan: [{ required: true, message: "请选择", trigger: "blur" }],
    number: [{ required: true, message: "请选择", trigger: "blur" }],
    jiepai: [{ required: true, message: "请选择", trigger: "blur" }],
    output: [{ required: true, message: "请选择", trigger: "blur" }],
    mojushangyou: [{ required: true, message: "请选择", trigger: "blur" }],
    qualityAffirm: [{ required: true, message: "请选择", trigger: "blur" }],
    classes: [{ required: true, message: "请选择", trigger: "blur" }],
  })

  //机床全部信息（通过接口获得）

  const data = {
    name: "",
    pageIndex: 1,
    pageSize: 10,
  }
  async function getMachineAll() {
    const result = await request.post("/machine/selectBaseInfo", data)
    return result
  }
  //审核的弹出框
  function open(data: any) {
    ElMessageBox.confirm("您确认审批【" + data.name + "】号机床吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request.post("/operate/auditingReport", {
          id: data.id,
          approver: JSON.parse(sessionStorage.getItem("currentUser")).account,
        })
        queryNow.value = true
        ElMessage({
          type: "success",
          message: "完成",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //查询功能
  function selectbyid() {
    console.log("formHead", formHead)

    queryParams.value = [
      {
        key: "machineId",
        value: formHead.id,
      },
    ]
    queryNow.value = true
    ElMessage({
      type: "success",
      message: "查询成功",
    })
  }
  //时间范围验证
  //给确认按钮动态添加disabled属性  为完善
  const buttonable = ref(false)
  function startTime(a: any) {
    if (Date.parse(a) > Date.parse(form.endTime)) {
      buttonable.value = true
      ElMessage({
        type: "error",
        message: "开始时间应小于结束时间",
      })
    } else {
      buttonable.value = false
    }
  }
  function endTime(a: any) {
    if (Date.parse(a) < Date.parse(form.startTime)) {
      buttonable.value = true
      ElMessage({
        type: "error",
        message: "结束时间应大于开始时间",
      })
    } else {
      buttonable.value = false
    }
  }

  //编辑框内的不良数量的确认按钮
  function EditAffirm() {}
  function demo() {
    console.log(123)
  }

  //交班的界面展示
  const isEditAndDelete = ref(true)

  const dialogVisible = ref(false)
  //配合交班完成的中间变量
  const tempJiaoBan = reactive({
    list: {},
  })
  function jiaoban(data: any) {
    dialogVisible.value = true
    console.log("data", data)
    tempJiaoBan.list = data
  }
  const formRulesjiaoban = reactive<FormRules>({
    yichangyuanyin: [{ required: true, message: "请输入异常原因", trigger: "blur" }],
    affirm: [{ required: true, message: "请选择", trigger: "blur" }],
  })
  const yichangyuanyinVisiable = computed(() => {
    if (form.affirm == "正常") {
      return false
    } else if (form.affirm == "异常") {
      return true
    } else {
      return false
    }
  })

  const jiaobanqueren = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
      if (valid) {
        isEditAndDelete.value = false

        tempJiaoBan.list.affirm = form.affirm
        tempJiaoBan.list.instructions = form.instructions
        tempJiaoBan.list.record = form.record
        tempJiaoBan.list.yichangyuanyin = form.yichangyuanyin
        console.log("tempJiaoBan.list", tempJiaoBan.list)
        tempJiaoBan.list.operator = JSON.parse(sessionStorage.getItem("currentUser")).account
        await request.post("/operate/updateReport", tempJiaoBan.list).then((data) => {
          console.log("交班结果", data)
          queryNow.value = true
          dialogVisible.value = false
          ElMessage({
            message: "交班成功",
            type: "success",
          })
        })
      }
    })
  }
  //查看按钮的操作
  //用来保存每次点击的数据
  const messageform: any = reactive({
    data: {},
  })
  //用来保存不良品履历
  const badTypeNumData = reactive({
    list: [],
  })
  const chakan = ref(false)
  async function chakananniu(data: any) {
    chakan.value = true

    messageform.data = data
    console.log("messageform", messageform)
    await request
      .post("/operate/selectReportJd", {
        reportId: messageform.data.id,
        pageSize: 100,
        pageIndex: 1,
      })
      .then((data: any) => {
        reprotByIdList.list = data.list

        console.log("获取相对应机床的稼动损失时间详情方法reprotByIdList", reprotByIdList)
      })
    //这里获取不良品履历
    await request
      .post("/operate/selectBadPHistory", { reportId: data.id, isContainZero: 0 })
      .then((data) => {
        console.log("查询不良品履历", data)
        badTypeNumData.list = data.list
        console.log("badTypeNumData.list", badTypeNumData.list)
      })
  }
  const jiadongDV = ref(false)
  const reportId = ref("")
  const reportList = reactive({
    list: [],
  })

  async function jiadongF(val) {
    console.log(val)
    jiadongDV.value = true
    reportId.value = val.id
  }
  //查询功能
  function SelectMachineByMachineId(data: any) {
    console.log("data", data)

    formHead.id = data.id
  }

  //编辑与新增操作的下拉框
  function SelectMachineByMachineIdEditOrInset(data: any) {
    console.log("data", data)
    form.machineId = data.id
  }

  //根据报工时间来进行勤务的判断
  //这个字段来判断是展示D勤还是E勤
  //const isD = ref(true)
  //这个方法来判断是D勤还是E勤
  function isDorE(time: any) {
    //time是传过来的当前时间
    const timenow = dayjs(time).format("HH:mm:ss")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
    // console.log("传递过来的时间的总秒数", timeMiao)

    const DStartTime = "08:00:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(DS[2])
    //  console.log("DS早上八点的总秒数", DSmiao)

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(DE[2])
    //  console.log("DS晚上八点的总秒数", DEmiao)
    if (timeMiao >= DSmiao && timeMiao < DEmiao) {
      console.log("这就是D勤的时间")
      form.distinguish = "D勤"
      // isD.value = true
      console.log("form", form)
    } else {
      console.log("这就是E勤的时间")
      //  isD.value = false
      form.distinguish = "E勤"
      console.log("form", form)
    }
  }
  function changeReportTime(value: any) {
    isDorE(value)
  }
  //查看里面的表格
  const reprotByIdList = reactive({
    list: [],
  })

  watch(badTypeNum, (newval: any, oldval) => {
    let count = 0

    for (let i = 0; i < badType.list.length; i++) {
      /// console.log("newval.list[i][badType.list[i].id]", newval.list[i][badType.list[i].id])
      count += Number(newval.list[i][badType.list[i].id])
      //console.log("badTypeNum.list", badTypeNum.list)
    }

    form.badNumber = count
    console.log("count", count)
    console.log("badTypeNum.list", badTypeNum.list)
  })
  const badNumberTemp: any = ref(0)
  watch(badTypeNumButton, async (newval: any, oldval) => {
    // console.log("form.badNumber", form.badNumber)
    // badNumberTemp.value = form.badNumber
    // let count = 0
    // console.log("变化了")
    // await newval.list.forEach((item) => {
    //   console.log("item", item)
    //   count += Number(item)
    // })
    // console.log("count", count)
    // badNumberTemp.value += count
    // console.log("badNumberTemp.value", badNumberTemp.value)
    //console.log("badTypeNumButton", badTypeNumButton)
    let count = 0

    for (let i = 0; i < badType.list.length; i++) {
      /// console.log("newval.list[i][badType.list[i].id]", newval.list[i][badType.list[i].id])
      count += Number(newval.list[i][badType.list[i].id])
      //console.log("badTypeNum.list", badTypeNum.list)
    }
    let temp = tempBadTpye.list.badNumber
    badNumberTemp.value = temp + count
  })

  //删除按钮
  function deleteData(data: any) {
    console.log("data", data)

    ElMessageBox.confirm("您确认删除此条信息吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request.post("/operate/deleteReport", { id: data.id }).then((data) => {
          console.log("删除操作")
        })
        queryNow.value = true
        ElMessage({
          type: "success",
          message: "删除成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除",
        })
      })
  }

  //这个是不良品维护的dialog
  const badgoodsDialog = ref(false)
  //用来保存下面的data
  const tempBadTpye = reactive({
    list: {},
  })

  async function badGoodsDialog(data: any) {
    badgoodsDialog.value = true
    queryNow.value = true
    console.log("1111111111")

    console.log("data", data)
    tempBadTpye.list = data
    badTypeNum.list.length = 0
    for (let i = 0; i < badType.list.length; i++) {
      let temp1: any = {}
      let id = badType.list[i].id
      temp1[id] = 0
      badTypeNum.list.push(temp1)
      temp1 = {}
    }
    //初始化用户需要填写的值
    badTypeNumButton.list.length = 0
    for (let i = 0; i < badType.list.length; i++) {
      let temp1: any = {}
      let id = badType.list[i].id

      temp1[id] = 0
      badTypeNumButton.list.push(temp1)
      temp1 = {}
    }

    await request
      .post("/operate/selectBadPHistoryCount", { reportId: data.id })
      .then((data: any) => {
        console.log("查询履历返回的接口", data)
        queryNow.value = true
        console.log("datareport.badNumber", data.total)
        badNumberTemp.value = data.total
        data.list.forEach((item1) => {
          badTypeNum.list.forEach((item) => {
            if (Object.keys(item)[0] == item1.badTypeId) {
              console.log("item", item)
              console.log("item1", item1)
              item[item1.badTypeId] = item1.count
              console.log("匹配上")
            }
          })
        })
        console.log("badTypeNum.list", badTypeNum.list)
      })

    // Object.assign(form, data)
  }
  async function querenBadType() {
    let tem: any = {
      badTypeIdCount: [],
    }
    let temp: any = []

    console.log("badTypeNum", badTypeNum)
    console.log("badTypeNumButton", badTypeNumButton)
    // badTypeNum.list.forEach((item1) => {
    //   badTypeNumButton.list.forEach((item2) => {
    //     // console.log(Object.keys(item1))
    //     // console.log(Object.keys(item2))
    //     if (Object.keys(item1)[0] == Object.keys(item2)[0]) {
    //       // console.log("匹配上")
    //       // console.log("item1", item1)
    //       //  console.log("item2", item2)
    //       temp.push({
    //         badTypeId: Object.keys(item1)[0],
    //         count: Number(item1[Object.keys(item1)[0]]) + Number(item2[Object.keys(item1)[0]]),
    //       })
    //     }
    //   })
    // })
    badTypeNumButton.list.forEach((item) => {
      console.log(Object.keys(item))
      console.log(Number(item[Object.keys(item)[0]]))
      if (Number(item[Object.keys(item)[0]]) !== 0) {
        temp.push({
          badTypeId: Object.keys(item)[0],
          count: Number(item[Object.keys(item)[0]]),
        })
      }
    })

    console.log("temp", temp)

    // //算总数的
    tem.badTypeIdCount = temp
    let one = JSON.stringify(tem)
    console.log("one", one)
    console.log("tempBadTpye", tempBadTpye)

    await request
      .post("/operate/updateReportBadTypeIdCount", {
        id: tempBadTpye.list.id,
        badTypeIdCount: one,
        badNumber: badNumberTemp.value,
        distinguish: tempBadTpye.list.distinguish,
        machineId: tempBadTpye.list.machineId,
        reportTime: tempBadTpye.list.reportTime,
        operator: JSON.parse(sessionStorage.getItem("currentUser")).account,
      })
      .then((data: any) => {
        console.log("小弹窗更新不良品数量", data)
        queryNow.value = true
        badgoodsDialog.value = false
      })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <MachineSelect
          style="width: 250px"
          :selected-first="false"
          @selected-item="SelectMachineByMachineId"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectbyid()">搜索</el-button>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <ExportExcelButton fileName="报工管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      :isEditAndDelete="false"
      :operateWidth="620"
      #default="{ scope }"
      query-api="/operate/selectReport"
      :query-params="queryParams"
      deleteApi="/operate/deleteReport"
    >
      <el-button type="success" @click="open(scope.row)">审批</el-button>
      <el-button type="primary" :disabled="scope.row.affirm != ''" @click="jiaoban(scope.row)"
        >交班</el-button
      >
      <el-button type="primary" @click="jiadongF(scope.row)">嫁动损失维护</el-button>
      <el-button type="primary" @click="badGoodsDialog(scope.row)">不良品维护</el-button>
      <el-button color="#626aef" @click="chakananniu(scope.row)" style="margin-right: 10px"
        >查看</el-button
      >
      <el-button
        type="primary"
        :disabled="scope.row.affirm != ''"
        style="margin-left: -1px"
        plain
        @click="openDrawer(scope.row)"
        >编辑</el-button
      >
      <el-button
        type="danger"
        :disabled="scope.row.affirm != ''"
        style="margin-left: 10px"
        plain
        @click="deleteData(scope.row)"
        >删除</el-button
      >
    </CTable>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="110px" :rules="formRules">
          <el-form-item label="设备号" prop="machineId">
            <MachineSelect
              style="width: 250px"
              :selected-first="false"
              @selected-item="SelectMachineByMachineIdEditOrInset"
              :selectMachineId="form.machineId"
            >
            </MachineSelect>
          </el-form-item>
          <el-form-item label="报工时间" prop="reportTime" :required="true">
            <el-date-picker
              v-model="form.reportTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              style="width: 250px"
              @change="changeReportTime"
            />
          </el-form-item>
          <el-form-item label="品番" prop="pinfan">
            <el-select v-model="form.pinfan" placeholder="请选择" style="width: 250px">
              <el-option label="品番1" value="品番1" />
              <el-option label="品番2" value="品番2" />
              <el-option label="品番3" value="品番3" />
            </el-select>
          </el-form-item>
          <el-form-item label="取数" prop="number">
            <el-input v-model="form.number" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="节拍" prop="jiepai">
            <el-input v-model="form.jiepai" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="生产数量" prop="output">
            <el-input v-model="form.output" style="width: 250px"> </el-input>
          </el-form-item>
          <el-form-item label="不良数量">
            <div style="border: 1px skyblue dotted; width: 250px">
              <div style="padding-left: 5px; color: #409eff"
                ><el-button type="primary" link :disabled="editbadnum" @click="demo">{{
                  form.badNumber
                }}</el-button></div
              >
              <div>
                <el-form-item
                  :label="item.name"
                  v-for="(item, index) in badType.list"
                  style="padding-bottom: 9px; padding-right: 15px"
                >
                  <el-input
                    v-model="badTypeNum.list[index][item.id]"
                    style="width: 60px"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="模具上油" prop="mojushangyou">
            <el-select v-model="form.mojushangyou" placeholder="请选择" style="width: 250px">
              <el-option label="是" value="是" />
              <el-option label="否" value="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="外观品质确认" prop="qualityAffirm">
            <el-select v-model="form.qualityAffirm" placeholder="请选择" style="width: 250px">
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
              <el-option label="3" value="3" />
              <el-option label="4" value="4" />
              <el-option label="5" value="5" />
              <el-option label="6" value="6" />
            </el-select>
          </el-form-item>
          <el-form-item label="班组" prop="classes">
            <el-select v-model="form.classes" placeholder="请选择" style="width: 250px">
              <el-option label="1班" value="1班" />
              <el-option label="2班" value="2班" />
              <el-option label="3班" value="3班" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)" :disabled="buttonable"
              >确认</el-button
            >
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
  <!-- 交班的界面 -->
  <el-dialog v-model="dialogVisible" title="交班记录" width="30%">
    <el-form :model="form" label-width="100px" ref="formRef" :rules="formRulesjiaoban">
      <el-form-item label="接班6S确认" prop="affirm">
        <el-select v-model="form.affirm" placeholder="请选择">
          <el-option label="正常" value="正常" />
          <el-option label="异常" value="异常" />
        </el-select>
      </el-form-item>
      <el-form-item label="异常原因" v-if="yichangyuanyinVisiable" prop="yichangyuanyin">
        <el-input v-model="form.yichangyuanyin" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="交班说明">
        <el-input v-model="form.instructions"></el-input>
      </el-form-item>
      <el-form-item label="交接班记录">
        <el-input v-model="form.record"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="jiaobanqueren(formRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 这里是查看按钮的界面 -->
  <el-dialog v-model="chakan" title="查看" width="75%">
    <el-scrollbar height="500px">
      <div
        class="main"
        style="width: 90.2%; border: 1px solid #c8c9cc; border-radius: 8px; margin-left: 24px"
      >
        <div style="position: relative; left: -40px; top: 0px; font-size: 18px">
          <el-tag style="font-size: 18px">基本信息</el-tag></div
        >
        <div class="contain">
          <span><label for=""> 机床号</label>&nbsp;:&nbsp;{{ messageform.data.name }}</span>
        </div>

        <div class="contain">
          <span
            ><label for="">异常原因</label>&nbsp;:&nbsp;{{ messageform.data.yichangyuanyin }}</span
          ></div
        >
        <div class="contain"
          ><span><label for="">品番</label>&nbsp;:&nbsp;{{ messageform.data.pinfan }} </span></div
        >
        <div class="contain">
          <span><label for="">取数</label>&nbsp;:&nbsp;{{ messageform.data.number }}</span>
        </div>
        <div class="contain">
          <span><label for="">节拍</label>&nbsp;:&nbsp;{{ messageform.data.jiepai }}</span></div
        >
        <div class="contain">
          <span><label for="">生产数量</label>&nbsp;:&nbsp;{{ messageform.data.output }}</span></div
        >
        <div class="contain"
          ><span
            ><label for="">不良数量</label>&nbsp;:&nbsp;{{ messageform.data.badNumber }}
          </span></div
        >
        <div class="contain">
          <span
            ><label for="">模具上油</label>&nbsp;:&nbsp;{{ messageform.data.mojushangyou }}</span
          >
        </div>
        <div class="contain">
          <span
            ><label for="">外观品质确认</label>&nbsp;:&nbsp;{{
              messageform.data.qualityAffirm
            }}</span
          ></div
        >
        <div class="contain">
          <span><label for="">操作人</label>&nbsp;:&nbsp;{{ messageform.data.operator }}</span></div
        >

        <div class="contain"
          ><span><label for="">班组</label>&nbsp;:&nbsp;{{ messageform.data.classes }} </span></div
        >
        <div class="contain"
          ><span
            ><label for="">勤务区分</label>&nbsp;:&nbsp;{{ messageform.data.distinguish }}
          </span></div
        >
        <div class="contain"
          ><span
            ><label for="">报工时间</label>&nbsp;:&nbsp;{{ messageform.data.operationTime }}
          </span></div
        >
      </div>
      <!-- 交班的查看 -->
      <div
        style="
          padding-left: 56px;
          border: 1px solid #c8c9cc;
          width: 90.5%;
          margin-top: 20px;
          border-radius: 8px;
          margin-left: 24px;
        "
      >
        <div>
          <el-tag style="position: relative; left: -40px; top: 10px; font-size: 18px"
            >交接班信息</el-tag
          ></div
        >
        <div class="contain" style="margin-top: 20px; height: 70px">
          <span
            ><label for="">接班6S确认</label>&nbsp;:&nbsp;{{ messageform.data.affirm }}</span
          ></div
        >
        <div class="contain"
          ><span
            ><label for="">交班说明 </label>&nbsp;:&nbsp;{{ messageform.data.instructions }}
          </span></div
        >
        <div class="contain">
          <span><label for="">交接班记录</label>&nbsp;:&nbsp;{{ messageform.data.record }}</span>
        </div>
      </div>
      <div
        style="
          padding-left: 55px;
          border: 1px solid #c8c9cc;
          margin-top: 20px;
          width: 90.5%;
          border-radius: 8px;
          margin-left: 24px;
        "
      >
        <div>
          <el-tag style="position: relative; left: -40px; top: 10px; font-size: 18px"
            >稼动损失维护</el-tag
          ></div
        >
        <el-table :data="reprotByIdList.list" style="width: 98%; margin-top: 20px">
          <el-table-column prop="flag" label="标识" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="startTime" label="稼动开始时间" />
          <el-table-column prop="endTime" label="稼动结束时间" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
      </div>
      <div
        style="
          padding-left: 55px;
          border: 1px solid #c8c9cc;
          margin-top: 20px;
          width: 90.5%;
          border-radius: 8px;
          margin-left: 24px;
        "
      >
        <div>
          <el-tag style="position: relative; left: -40px; top: 10px; font-size: 18px"
            >不良品履历</el-tag
          ></div
        >
        <el-table :data="badTypeNumData.list" style="width: 98%; margin-top: 20px">
          <el-table-column prop="badTypeName" label="类型" />
          <el-table-column prop="count" label="数量" />
          <el-table-column prop="operator" label="操作人" />
          <el-table-column prop="operateTime" label="操作时间" />
        </el-table>
      </div>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="chakan = false">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <JiadongDetail
    v-model:showDV="jiadongDV"
    :report-id="reportId"
    :report-list="reportList"
  ></JiadongDetail>

  <!-- 不良品维护的dialog -->
  <el-dialog v-model="badgoodsDialog" title="不良品维护" width="30%">
    <el-form ref="formRef" :model="form" label-width="100px" :rules="formRules">
      <el-form-item label="不良数量">
        <div style="border: 1px skyblue dotted; width: 250px">
          <div style="padding-left: 5px; color: #409eff"
            ><el-button type="primary" link :disabled="editbadnum" @click="demo">{{
              badNumberTemp
            }}</el-button></div
          >
          <div>
            <el-form-item
              :label="item.name"
              v-for="(item, index) in badType.list"
              style="padding-bottom: 9px; padding-right: 15px"
            >
              <!-- <el-button link v-if="isshowadd">{{ badTypeNum.list[index] }}</el-button
                  ><span v-if="isshowadd">&nbsp;+&nbsp;&nbsp;</span> -->
              <el-input
                v-model="badTypeNum.list[index][item.id]"
                disabled
                style="width: 60px"
              ></el-input>
              &nbsp;+
              <el-input
                v-model="badTypeNumButton.list[index][item.id]"
                style="width: 60px"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="badgoodsDialog = false">取消</el-button>
        <el-button type="primary" @click="querenBadType">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
  .main {
    height: 250px;
    width: 100%;
    padding-left: 60px;
    padding-top: 20px;
  }
  .contain {
    font-size: 16px;
    margin-top: 5px;
    display: inline-block;
    width: 400px;
    height: 35px;
    margin-left: 8px;
    line-height: 50px;
  }

  .contain label {
    display: inline-block;
    width: 110px;
    border: 1px solid rebeccapurpl;
    text-align: left;
    font-weight: 800;
    color: darkgray;
  }
  #drawwidth {
    width: 250px;
  }
</style>
