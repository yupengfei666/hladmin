<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref, onUnmounted } from "vue"
  import type { FormInstance, FormRules } from "element-plus"
  import { ElMessageBox, ElMessage } from "element-plus"
  import request from "../../common/request"
  import dayjs from "dayjs"

  import { role } from "../../common/common"
  import { useRoute } from "vue-router"

  const route = useRoute()
  const userT = route.query.userInfo
    ? JSON.parse(route.query.userInfo)
    : JSON.parse(sessionStorage.getItem("currentUser"))
  const user = reactive(userT)
  const token = ref(sessionStorage.getItem("token"))
  let time: any = ""
  const tableItem = [
    {
      prop: "content",
      label: "交班内容",
    },
    {
      prop: "name",
      label: "机床号",
      width: 100,
    },
    {
      prop: "isGoOffWork",
      label: "是否交班",
      width: 80,
    },
    {
      prop: "workName",
      label: "班组",
      width: 60,
    },
    {
      prop: "qinwu",
      label: "勤务",
      width: 60,
    },
    {
      prop: "zhiwu",
      label: "职务",
      width: 80,
    },
    {
      prop: "createPersonName",
      label: "创建人",
      width: 80,
    },
    {
      prop: "crateTime",
      label: "创建时间",
      width: 170,
    },
  ]

  const queryNow = ref(false)
  const queryParams = ref([])

  onMounted(async () => {
    queryParams.value = [
      {
        key: "type",
        value: "1",
      },
      // {
      //   key: "workName",
      //   value: JSON.parse(sessionStorage.getItem("currentUser")).class,
      // },
    ]
    getJiaoBanweiwancheng()
    getMachineAll()
    queryNow.value = true
    await getDateAndQinWu()
    await jiebanorjiaoban()
    //  istimesure()
    time = setInterval(async () => {
      await istimesure()
    }, 1000)
    console.log(time)

    getBanzhangAccount()
    getJieBanGroup()
  })
  onUnmounted(() => {
    clearInterval(time)

    console.log("接触挂在")
  })

  const JiaoBanAllData = reactive({
    list: [],
  })
  //显示是否已经交接班
  const iswork = ref("")
  const currentQinWu = ref("")

  //获取到交班的未完成的信息
  function getJiaoBanweiwancheng() {
    request
      .post("/work/selectWorkList", {
        type: "0",
        workName: user.class,
      })
      .then((data) => {
        JiaoBanAllData.list = data.list
        console.log("JiaoBanAllData.list", JiaoBanAllData.list)
      })
  }

  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    id: "",
    content: "",
    machineId: "",
    parentId: "",
    type: "",
    workName: "",
    qinwu: "",
    zhiwu: "",
    crateTime: "",
    reportDate: "",
    createPerson: user.account,
  })
  const formHead = reactive({
    name: "",
    id: "",
  })
  const formRef = ref<FormInstance>()
  const formRules = reactive<FormRules>({
    content: [{ required: true, message: "请输入交班记录", trigger: "blur" }],
    type: [{ required: true, message: "请选择", trigger: "blur" }],
    workName: [{ required: true, message: "请选择", trigger: "blur" }],
    qinwu: [{ required: true, message: "请选择", trigger: "blur" }],
    zhiwu: [{ required: true, message: "请选择", trigger: "blur" }],
  })
  function openDrawer(data = "") {
    drawer.show = true

    if (data) {
      console.log("data", data)

      drawer.title = "编辑"
      // Object.assign(form, data)
      if (data.type == "待完成") {
        form.type = "0"
      } else {
        form.type = "1"
      }

      form.content = data.content
      form.id = data.id
      form.machineId = data.machineId
      form.qinwu = data.qinwu
      getDateParentAndChild()
      form.workName = user.class
      form.zhiwu = user.role
      form.crateTime = data.crateTime
      form.createPerson = user.account
      console.log("form", form)
      // form.type
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        id: "",
        machineId: "",
        content: "",
        parentId: "",
        type: "0",
        workName: user.class,
        qinwu: "",
        zhiwu: user.role,
        crateTime: "",
        createPerson: user.account,
        reportDate: "",
      })
      isDorE(Date.now())
      getDateParentAndChild()
    }
  }
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        console.log("新增信息!")
        let url = ""
        if (drawer.title == "新增") {
          url = "/work/addWorkList"
        } else {
          url = "/work/updateWorkListType"
        }
        console.log("form", form)

        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)

          getJiaoBanweiwancheng()
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

  //删除操作
  function deletebyid(data: any) {
    console.log("data", data)
    ElMessageBox.confirm("您确认要删除此条数据吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request.post("/work/deleteWorkList", { id: data.id }).then((data) => {
          console.log("删除操作", data)
        })
        getJiaoBanweiwancheng()
        queryNow.value = true
        ElMessage({
          type: "success",
          message: "删除成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //主题详情操作
  const topicForm = reactive({
    id: "",
    content: "",
    type: "0",
    qinwu: "",
    workName: "",
    zhiwu: "",
    parentId: "",
    createPerson: user.account,
    reportDate: "",
  })

  const topicData = reactive({
    list: [],
  })
  const TopicdialogVisible = ref(false)
  const topsByIdData = reactive({
    list: {},
  })
  async function getTopicData(data: any) {
    //获取对应的主题详情
    console.log("data", data)
    topsByIdData.list = data
    //获取此父任务的所有子任务

    topicData.list = data.workChild
    TopicdialogVisible.value = true
  }

  //控制新增详情操作
  const addOrEditdialogVisible = ref(false)
  const topsDataTitle = reactive({
    title: "新增详情",
  })

  function submitTopicForm(formEl: FormInstance | undefined) {
    if (!formEl) return

    formEl.validate(async (valid) => {
      if (valid) {
        let url = ""
        if (topsDataTitle.title == "新增详情") {
          url = "/work/addWorkList"
        } else {
          url = "/work/updateWorkListType"
        }
        console.log("topicForm", topicForm)

        await request
          .post(url, {
            content: topicForm.content,
            type: topicForm.type,
            createPerson: user.account,
            crateTime: topicForm.crateTime,
            qinwu: topicForm.qinwu,
            workName: user.class,
            zhiwu: user.role,
            parentId: topicForm.parentId,
            machineId: topicForm.machineId,
            id: topicForm.id,
            reportDate: topicForm.reportDate,
          })
          .then((data) => {
            console.log("新增或者编辑的返回值", data)
            // addOrEditdialogVisible.value = false
            addOrEditdialogVisible.value = false
            queryNow.value = true

            getJiaoBanweiwancheng()
          })
      }
    })
  }
  //删除操作
  function deleteByIdTopic(data: any) {
    console.log("data", data)
    ElMessageBox.confirm("您确定要删除此条数据吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request.post("/work/deleteWorkChildList", { id: data.id }).then((data) => {
          console.log("主题子信息的删除", data)
          getTopicData(topsByIdData.list)
        })

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
  //这个方法来判断是D勤还是E勤
  function isDorE(time: any) {
    //time是传过来的当前时间
    const timenow = dayjs(time).format("HH:mm:ss")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
    console.log("传递过来的时间的总秒数", timeMiao)

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
      form.qinwu = "D勤"

      // isD.value = true
      console.log("form", form)
    } else {
      console.log("这就是E勤的时间")
      //  isD.value = false
      form.qinwu = "E勤"

      console.log("form", form)
    }
  }

  //用来存储所有机床
  const machineAll = reactive({
    list: [],
  })

  //查询所有机床
  function getMachineAll() {
    request.post("/machine/selectBaseInfo", { pageSize: 1000, pageIndex: 1 }).then((data: any) => {
      machineAll.list = data.list
      console.log("查询所有机床", machineAll.list)
    })
  }
  //新增详情
  function addDetail(data: any) {
    console.log("data", data)
    if (data.parentId) {
      topsDataTitle.title = "编辑详情"
      Object.assign(topicForm, data)
      getDateParentAndChild()
      if (data.type == "已完成") {
        topicForm.type = "1"
      } else {
        topicForm.type = "0"
      }
    } else {
      topsDataTitle.title = "新增详情"
      topicForm.parentId = data.id
      topicForm.content = ""
      topicForm.type = "0"
      topicForm.qinwu = data.qinwu
      topicForm.workName = data.workName
      topicForm.zhiwu = data.zhiwu
      getDateParentAndChild()
    }
    addOrEditdialogVisible.value = true
  }
  //改变子类的状态
  function changeChildStatus(data: any, val) {
    console.log("data", data)
    ElMessageBox.confirm("您确定将此条任务的状态改为【" + data.type + "】吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        if (data.type == "待完成") {
          request
            .post("/work/updateWorkType", { id: data.id, type: "0", parentId: data.parentId })
            .then((item) => {
              console.log("修改详情的状态", item)
              getJiaoBanweiwancheng()
            })
        } else {
          request
            .post("/work/updateWorkType", { id: data.id, type: "1", parentId: data.parentId })
            .then((item) => {
              console.log("修改详情的状态", item)
              getJiaoBanweiwancheng()
              queryNow.value = true
            })
        }

        ElMessage({
          type: "success",
          message: "修改成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消修改",
        })
        getJiaoBanweiwancheng()
      })
  }
  //改变父类的状态
  function changeParentStatus(data1: any) {
    console.log("父类的信息", data1)
    ElMessageBox.confirm("您确定将此条任务的状态改为【" + data1.type + "】吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        if (data1.type == "待完成") {
          request
            .post("/work/updateWorkType", { id: data1.id, type: "0", parentId: data1.parentId })
            .then((item) => {
              console.log("修改父类的状态", item)
              getJiaoBanweiwancheng()
              queryNow.value = true
            })
        } else {
          request.post("/work/updateWorkType", { id: data1.id, type: "1" }).then((item) => {
            console.log("修改父类的状态", item)
            getJiaoBanweiwancheng()
            queryNow.value = true
          })
        }

        ElMessage({
          type: "success",
          message: "修改成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消修改",
        })
        getJiaoBanweiwancheng()
      })
  }

  //改变子类的状态
  function changeChildrenStatus(data1: any) {
    console.log("子类的信息", data1)
    ElMessageBox.confirm("您确定将此条任务的状态改为【" + data1.type + "】吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        if (data1.type == "待完成") {
          request
            .post("/work/updateWorkType", { id: data1.id, type: "0", parentId: data1.parentId })
            .then((item) => {
              console.log("修改子类的状态", item)
              getJiaoBanweiwancheng()
              queryNow.value = true
              TopicdialogVisible.value = false
            })
        } else {
          request.post("/work/updateWorkType", { id: data1.id, type: "1" }).then((item) => {
            console.log("修改子类的状态", item)
            getJiaoBanweiwancheng()
            queryNow.value = true
            TopicdialogVisible.value = false
          })
        }

        ElMessage({
          type: "success",
          message: "修改成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消修改",
        })
        getJiaoBanweiwancheng()
      })
  }

  //这个用来控制已完成的编辑dialog
  const complateDialogEdit = ref(false)

  function complateEdit(data: any) {
    complateDialogEdit.value = true
    Object.assign(topicForm, data)
    console.log("data", data)
  }
  function submitComplate(formEl: FormInstance | undefined) {
    if (!formEl) return

    formEl.validate(async (valid) => {
      if (valid) {
        console.log("topicForm", topicForm)
        request
          .post("/work/updateWorkListType", {
            content: topicForm.content,

            createPerson: user.account,
            crateTime: topicForm.crateTime,
            qinwu: topicForm.qinwu,
            workName: user.class,
            zhiwu: user.role,
            parentId: topicForm.parentId,
            machineId: topicForm.machineId,
            id: topicForm.id,
          })
          .then((data) => {
            console.log("已完成界面修改子任务", data)
            complateDialogEdit.value = false
            queryNow.value = true
            TopicdialogVisible.value = false
            ElMessage({
              type: "success",
              message: "修改成功",
            })
          })
      }
    })
  }
  //交班操作
  function jiaoban() {
    ElMessageBox.confirm("您确认进行交班吗", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        request.post("/work/GoOffWork", { workName: user.class }).then(async (data: any) => {
          console.log("交班操作成功", data)
          getJiaoBanweiwancheng()
          queryNow.value = true
          jiaobansuretemp.value = true
          console.log("jiaobansure", jiaobansure.value)
          await jiebanorjiaoban()
        })

        ElMessage({
          type: "success",
          message: "交班成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消交班",
        })
      })
  }
  //接班操作

  //获取可接班的班组
  const jiebanGroup = reactive({
    list: [],
  })
  function getJieBanGroup() {
    request.post("/work/selectGoOffWorkPerson").then((data: any) => {
      console.log("获取可接班的班组", data)
      jiebanGroup.list = data.list
      jiebanForm.workName = data.list[0]
      console.log("form", form)
    })
  }

  console.log("当前用户的user", user)

  const jiebandialogVisible = ref(false)
  const jiebanForm = reactive({
    banZhang: "",
    token: token,
    qinwu: "",
    currentClass: user.class,
    zhiwu: user.role,
    workName: "",
    reportDate: "",
    jieBanDanDang: user.account,
  })
  const jiebanType = ref("")

  function jieban() {
    if (jiebanType.value == "1") {
      request
        .post("/work/selectWhetherGoOnWork", {
          banZu: user.class,
          type: jiebanType.value,
        })
        .then((data: any) => {
          if (data.code == 1) {
            jiebandialogVisible.value = true
            // isDorE(Date.now())
          } else {
            ElMessage({
              type: "error",
              message: data.message,
            })
          }
        })
    } else {
      request
        .post("/work/selectWhetherGoOnWork", { banZu: user.class, type: jiebanType.value })
        .then((data: any) => {
          if (data.code == 1) {
            jiebandialogVisible.value = true
            // isDorE(Date.now())
          } else {
            ElMessage({
              type: "error",
              message: data.message,
            })
          }
        })
    }
  }

  function JiebansubmitForm(formEl: FormInstance | undefined) {
    if (!formEl) return

    formEl.validate(async (valid) => {
      if (valid) {
        console.log("jiebanForm", jiebanForm)
        request.post("/work/GoToWork", jiebanForm).then(async (data) => {
          queryNow.value = true
          console.log("data", data)
          jiebansuretemp.value = true
          console.log("接班", jiebansure)

          jiebandialogVisible.value = false
          getJiaoBanweiwancheng()

          await jiebanorjiaoban()

          ElMessage({
            type: "success",
            message: "接班成功",
          })
        })
      }
    })
  }
  //判断当前班组是否已经交班

  function isDoneToWork() {
    request
      .post("/work/isDoneGoToWork", {
        workName: user.class,
      })
      .then((data) => {
        console.log("判断当前班组是否已经交班", data)
        iswork.value = data.jiaoBanStatus
        currentQinWu.value = data.qinwu
      })
  }
  isDoneToWork()
  //判断时间七点五十九到八点一分  晚上七点五十九到八点一分  如果是这个时间段则不允许交班
  //控制交班按钮可以按不  默认为false 表示按钮可以按
  //获取
  const jiaobansure = ref(false)
  const jiaobansuretemp = ref(false)
  function istimesure() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm:ss")
    // console.log("当前时间", timenow)

    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60 + Number(timeArray[2])
    // console.log("当前时间的总秒数", timeMiao)

    const DStartTime = "07:59:00"

    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60 + Number(DS[2])
    // console.log("早上七点五十九的总秒数", DSmiao)

    const DEndTime = "19:59:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60 + Number(DE[2])

    //交班的逻辑
    // 交班
    // if((curren qinwu = D && [19-21)) || (curren qinwu = E勤 && [07-09)) ){
    //      --- 交班 =
    // isGotoWork(1)  0  ----交班 = true
    //                1  ----交班 = false
    // }
    // else  交班 = false
    if (
      (currentQinWu.value == "D勤" &&
        timeMiao >= DEmiao - 59 * 60 &&
        timeMiao < DEmiao + 61 * 60) ||
      (currentQinWu.value == "E勤" && timeMiao >= DSmiao - 59 * 60 && timeMiao < DSmiao + 61 * 60)
    ) {
      console.log("(curren qinwu = D && [19-21)) || (curren qinwu = E勤 && [07-09)) ")

      console.log("交班的逻辑，此时是允许交班的")
      //   jiaobansure.value = false
      // 在根据接口进行判断是否可以进行交班
      if (jiaobansuretemp.value == true) {
        jiaobansure.value = true
        console.log("自身已经交班了")
      } else {
        jiaobansure.value = false
        console.log("自身没有交班")
      }
    } else {
      jiaobansure.value = true
    }
    //接班的逻辑

    if (timeMiao >= DSmiao && timeMiao <= DSmiao + 60 * 2) {
      jiebansure.value = true
      console.log("现在不允许交班")
    } else {
      if (jiebansuretemp.value == true) {
        jiebansure.value = true
        console.log("自身已经接班了")
      } else {
        jiebansure.value = false
        console.log("自己没有进行接班")
      }
    }
  }

  //获取当前用户的所在班组的班长
  function getBanzhangAccount() {
    request
      .post("/RiJia/selectCurrentClass", {
        token: token,
        className: user.class,
        current: 1,
        size: 10000,
      })
      .then((data: any) => {
        //  console.log("获取当前班次人员列表进而找到班长的account", data)
        data.list.forEach((item) => {
          // console.log(item)
          if (item.roleName == role.banzhang) {
            //这里是当前班长的account
            // console.log(item.account)
            //   console.log("班长的信息", item)

            jiebanForm.banZhang = item.account
          }
        })
      })
  }

  //这个来分辨是否为早上7点到早上八点，晚上七点到晚上八点  与平常时间
  function isDorEseven() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm")
    //  console.log("当前时间", timenow)
    // console.log("121651613213213213213212313213213213213213213165")

    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60
    // console.log("当前时间的总秒数", timeMiao)

    const DStartTime = "07:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60
    // console.log("早上7点的总秒数", DSmiao)

    const DEndTime = "19:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60
    // console.log("晚上7点的总秒数", DEmiao)
    if (timeMiao <= DSmiao + 60 * 60 && timeMiao >= DSmiao) {
      // console.log("现在是早上七点到早上八点之间")
      jiebanType.value = "1"
    } else if (timeMiao >= DEmiao && timeMiao <= DEmiao + 60 * 60) {
      //  console.log("现在是晚上七点到晚上八点之间")
      // console.log("应该传的时间为：", dayjs().format("YYYY-MM-DD"))
      jiebanType.value = "1"
    } else {
      console.log("现在是正常时间")
      jiebanType.value = "2"
    }
  }
  isDorEseven()

  //用来传递接班的时间
  function getDateAndQinWu() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60

    const DStartTime = "07:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60

    const DEndTime = "19:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60
    //
    if (timeMiao >= DSmiao && timeMiao <= DEmiao) {
      console.log("现在是D勤时间")
      jiebanForm.qinwu = "D勤"
    } else {
      console.log("现在是E勤时间")
      jiebanForm.qinwu = "E勤"
    }

    if (timeMiao >= DSmiao) {
      console.log("时间取当天时间")
      console.log(dayjs().format("YYYY-MM-DD"))
      jiebanForm.reportDate = dayjs().format("YYYY-MM-DD")
    } else {
      console.log("时间取昨天")
      console.log(dayjs().subtract(1, "day").format("YYYY-MM-DD"))
      jiebanForm.reportDate = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
  }
  //用来传递新建父任务与子任务的日期
  function getDateParentAndChild() {
    //time是传过来的当前时间
    const timenow = dayjs().format("HH:mm")
    const timeArray = timenow.split(":")
    const timeMiao = Number(timeArray[0]) * 3600 + Number(timeArray[1]) * 60

    const DStartTime = "08:00"
    const DS = DStartTime.split(":")
    const DSmiao = Number(DS[0]) * 3600 + Number(DS[1]) * 60

    const DEndTime = "20:00:00"
    const DE = DEndTime.split(":")
    const DEmiao = Number(DE[0]) * 3600 + Number(DE[1]) * 60
    //

    if (timeMiao >= DSmiao) {
      console.log("时间取当天时间")
      console.log(dayjs().format("YYYY-MM-DD"))
      form.reportDate = dayjs().format("YYYY-MM-DD")
      topicForm.reportDate = dayjs().format("YYYY-MM-DD")
    } else {
      console.log("时间取昨天")
      console.log(dayjs().subtract(1, "day").format("YYYY-MM-DD"))
      form.reportDate = dayjs().subtract(1, "day").format("YYYY-MM-DD")
      topicForm.reportDate = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
  }

  //判断是否进行过交接班
  const jiebansure = ref(false)
  const jiebansuretemp = ref(false)
  async function jiebanorjiaoban() {
    await request
      .post("/work/isGoToWork", {
        className: user.class,
        type: "1",
        distinguish: jiebanForm.qinwu,
        reportDate: jiebanForm.reportDate,
      })
      .then((data: any) => {
        console.log("判断是否进行过交班", data.message)
        if (data.code == 0) {
          jiaobansuretemp.value = false
        } else {
          jiaobansuretemp.value = true
        }
      })

    await request
      .post("/work/isGoToWork", {
        className: user.class,
        type: "2",
        distinguish: jiebanForm.qinwu,
        reportDate: jiebanForm.reportDate,
      })
      .then((data: any) => {
        console.log("判断是否进行过接班", data.message)
        if (data.code == 0) {
          jiebansuretemp.value = false
        } else {
          jiebansuretemp.value = true
        }
      })
  }
  const pageStyle = ref("margin: 0px")
  pageStyle.value = route.query.userInfo ? "margin: 22px 8px 8px 8px" : "margin: 0px"
</script>

<template>
  <div :style="pageStyle">
    <header class="form-head">
      <el-form :inline="true" :model="formHead" style="margin-left: -8px; margin-top: -15px">
        <el-form-item>
          <el-button type="primary" :disabled="jiaobansure" @click="jiaoban()">交班</el-button>

          <el-tooltip placement="bottom">
            <template #content>
              交班：<br />1、7:59-8:01 19:59-20:01 不可交班<br />
              2、当前组进行过交班 不可交班<br />3、当前组有其他班组在接班 不可交班<br />4、当前组接班时是D勤-->19:00-21:00交班<br />5、当前组
              接班时是E勤-->07:00-09:00交班
            </template>
            <div id="tips">?</div>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="jiebansure" @click="jieban()">接班</el-button>

          <el-tooltip placement="bottom">
            <template #content>
              接班：<br />
              1、7:59-8:01 19:59-20:01 不可接班<br />
              2、当前组未进行过交班 不可接班<br />
              3、未进行过人员分配 不可接班</template
            >
            <div id="tips">?</div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="当前用户：">{{ user.name }} </el-form-item>
        <el-form-item label="用户班组：">{{ user.class }} </el-form-item>
        <el-form-item label="用户职务：">{{ user.role }} </el-form-item>
        <el-form-item label="是否交班：">{{ iswork }} </el-form-item>
      </el-form>
    </header>
    <main>
      <el-tabs tab-position="top" style="height: 700px; margin-top: -12px" class="demo-tabs">
        <!-- 未完成的界面 -->
        <el-tab-pane label="未完成">
          <el-form-item>
            <el-button type="primary" :disabled="iswork == '是'" @click="openDrawer()"
              >新增</el-button
            >
          </el-form-item>
          <!-- 这里是树形 -->
          <el-table
            :data="JiaoBanAllData.list"
            default-expand-all
            style="width: 100%"
            scrollbar-always-on
            height="600"
          >
            <el-table-column type="expand">
              <template #default="props">
                <div m="4" v-if="props.row.workChild">
                  <h4 style="margin-left: 2%">详情</h4>
                  <el-table
                    style="margin-left: 6.3%; border: 1px solid #c8c9cc; width: 93.7%"
                    :data="props.row.workChild"
                  >
                    <el-table-column label="内容" prop="content" :width="170" />
                    <!-- <el-table-column label="状态" prop="type" /> -->
                    <!-- <el-table-column label="是否交班" prop="isGoOffWork" /> -->
                    <el-table-column label="勤务" prop="qinwu" />
                    <el-table-column label="班组" prop="workName" />
                    <el-table-column label="职务" prop="zhiwu" />

                    <el-table-column label="创建人" prop="createPersonName" />
                    <el-table-column label="创建时间" prop="crateTime" />
                    <el-table-column fixed="right" label="操作" :width="280">
                      <template #default="scope">
                        <el-select
                          @change="changeChildStatus(scope.row, $event)"
                          v-model="scope.row.type"
                          class="m-2"
                          :disabled="scope.row.isGoOffWork == '是'"
                          placeholder="请选择"
                          style="width: 100px; margin-right: 12px"
                        >
                          <el-option label="待完成" value="待完成" />
                          <el-option label="已完成" value="已完成" />
                        </el-select>
                        <el-button
                          :disabled="scope.row.isGoOffWork == '是'"
                          @click="addDetail(scope.row)"
                          plain
                          type="primary"
                          >编辑</el-button
                        >
                        <el-button
                          :disabled="scope.row.isGoOffWork == '是'"
                          @click="deletebyid(scope.row)"
                          plain
                          type="danger"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>

            <el-table-column fixed type="index" label="序号" :width="60"></el-table-column>
            <el-table-column label="内容" prop="content" :width="400" />
            <el-table-column label="机床号" prop="name" />
            <!-- <el-table-column label="状态" prop="type" /> -->
            <!-- <el-table-column label="是否交班" prop="isGoOffWork" /> -->
            <el-table-column label="勤务" prop="qinwu" />
            <el-table-column label="班组" prop="workName" />
            <el-table-column label="职务" prop="zhiwu" />
            <el-table-column label="创建人" prop="createPersonName" />
            <el-table-column label="创建时间" prop="crateTime" :width="170" />
            <el-table-column fixed="right" label="操作" :width="380">
              <template #default="scope">
                <el-select
                  @change="changeParentStatus(scope.row)"
                  v-model="scope.row.type"
                  class="m-2"
                  :disabled="scope.row.isGoOffWork == '是' || scope.row.workChildSize !== 0"
                  placeholder="请选择"
                  style="width: 100px; margin-right: 12px"
                >
                  <el-option label="待完成" value="待完成" />
                  <el-option label="已完成" value="已完成" />
                </el-select>
                <el-button
                  :disabled="scope.row.isGoOffWork == '是'"
                  @click="addDetail(scope.row)"
                  type="primary"
                  >新增详情</el-button
                >
                <el-button
                  :disabled="scope.row.isGoOffWork == '是'"
                  @click="openDrawer(scope.row)"
                  plain
                  type="primary"
                  >编辑</el-button
                >
                <el-button
                  :disabled="scope.row.isGoOffWork == '是'"
                  @click="deletebyid(scope.row)"
                  plain
                  type="danger"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 已完成的界面 -->
        <el-tab-pane label="已完成">
          <CTable
            @edit-item="openDrawer"
            :tableItem="tableItem"
            v-model:queryNow="queryNow"
            query-api="/work/selectWorkList"
            deleteApi="/work/deleteWorkList"
            :query-params="queryParams"
            :operateWidth="270"
            #default="{ scope }"
          >
            <el-select
              v-if="!scope.row.workChild"
              v-model="scope.row.type"
              class="m-2"
              @change="changeParentStatus(scope.row)"
              placeholder="请选择"
              style="width: 100px; margin-right: 14px"
            >
              <el-option label="待完成" value="待完成" />
              <el-option label="已完成" value="已完成" />
            </el-select>

            <el-button
              type="success"
              v-if="scope.row.workChild"
              @click="getTopicData(scope.row)"
              style="margin-right: 12px"
              >主题详情</el-button
            >
            <el-button
              :disabled="scope.row.isGoOffWork == '是'"
              @click="openDrawer(scope.row)"
              plain
              type="primary"
              >编辑</el-button
            >
            <el-button
              :disabled="scope.row.isGoOffWork == '是'"
              @click="deletebyid(scope.row)"
              plain
              type="danger"
              >删除</el-button
            >
          </CTable>
        </el-tab-pane>
      </el-tabs>
    </main>
    <aside>
      <!-- 这里是编辑的右滑框 -->
      <el-drawer :title="drawer.title" v-model="drawer.show" :size="500">
        <el-form ref="formRef" :model="form" label-width="80px" :rules="formRules">
          <el-form-item label="机床号">
            <el-select
              v-model="form.machineId"
              class="m-2"
              filterable
              clearable
              style="width: 250px"
              placeholder="请选择"
            >
              <el-option v-for="item in machineAll.list" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="交班记录" prop="content">
            <el-input
              :rows="3"
              type="textarea"
              v-model="form.content"
              style="width: 250px"
            ></el-input>
          </el-form-item>
          <el-form-item label="班组" prop="workName">
            <el-select
              disabled
              v-model="form.workName"
              class="m-2"
              style="width: 250px"
              placeholder="请选择"
            >
              <el-option label="1班" value="1班" />
              <el-option label="2班" value="2班" />
            </el-select>
          </el-form-item>
          <el-form-item label="勤务" prop="qinwu">
            <el-select v-model="form.qinwu" class="m-2" style="width: 250px" placeholder="请选择">
              <el-option label="D勤" value="D勤" />
              <el-option label="E勤" value="E勤" />
            </el-select>
          </el-form-item>
          <el-form-item label="职务" prop="zhiwu">
            <el-select
              disabled
              v-model="form.zhiwu"
              class="m-2"
              style="width: 250px"
              placeholder="请选择"
            >
              <el-option label="组长" value="组长" />
              <el-option label="班长" value="班长" />
              <el-option label="课长" value="课长" />
            </el-select>
          </el-form-item>

          <el-form-item label="记录状态" prop="type" v-if="drawer.title == '新增'">
            <el-select
              disabled
              v-model="form.type"
              class="m-2"
              placeholder="请选择"
              style="width: 250px"
            >
              <el-option value="1" label="已完成" />
              <el-option value="0" label="待完成" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </aside>
    <!-- 这里是主题详情dialog -->
    <el-dialog v-model="TopicdialogVisible" title="主题详情" width="60%">
      <!-- <el-button type="primary" @click="addTopicData()">新增</el-button> -->
      <el-table :data="topicData.list" style="width: 100%">
        <el-table-column prop="content" label="内容" width="100" />
        <!-- <el-table-column prop="type" label="状态" /> -->
        <el-table-column prop="workName" label="班组" />
        <el-table-column prop="qinwu" label="勤务" />
        <el-table-column prop="zhiwu" label="职务" />

        <el-table-column prop="createPersonName" label="创建人" />
        <el-table-column prop="crateTime" label="创建时间" width="170" />

        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-select
              v-model="scope.row.type"
              class="m-2"
              @change="changeChildrenStatus(scope.row)"
              placeholder="请选择"
              style="width: 100px; margin-right: 14px"
            >
              <el-option label="待完成" value="待完成" />
              <el-option label="已完成" value="已完成" />
            </el-select>

            <el-button
              type="primary"
              plain
              :disabled="scope.row.isGoOffWork == '是'"
              @click="complateEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              :disabled="scope.row.isGoOffWork == '是'"
              plain
              @click="deleteByIdTopic(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="TopicdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="TopicdialogVisible = false">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这里是编辑与新增的编辑页面   这个用于未完成的界面-->
    <el-dialog v-model="addOrEditdialogVisible" :title="topsDataTitle.title" width="30%">
      <el-form ref="formRef" :model="topicForm" label-width="120px" :rules="formRules">
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :row="2"
            v-model="topicForm.content"
            style="width: 250px"
          ></el-input>
        </el-form-item>

        <el-form-item label="完成状态" prop="type" v-if="topsDataTitle.title == '新增详情'">
          <el-select
            v-model="topicForm.type"
            :disabled="true"
            class="m-2"
            placeholder="请选择"
            style="width: 250px"
          >
            <el-option label="待完成" value="0" />
            <el-option label="已完成" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addOrEditdialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTopicForm(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 这个用于已完成的编辑 -->
    <el-dialog v-model="complateDialogEdit" title="编辑" width="30%">
      <el-form ref="formRef" :model="topicForm" label-width="120px" :rules="formRules">
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :row="2"
            v-model="topicForm.content"
            style="width: 250px"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="complateDialogEdit = false">取消</el-button>
          <el-button type="primary" @click="submitComplate(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 接班的dialog -->
    <el-dialog v-model="jiebandialogVisible" title="接班" width="30%">
      <el-form ref="formRef" :model="jiebanForm" label-width="120px" :rules="formRules">
        <el-form-item label="交班班组">
          <el-select
            v-model="jiebanForm.workName"
            class="m-2"
            placeholder="请选择"
            style="width: 250px"
          >
            <el-option v-for="item in jiebanGroup.list" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="勤务">
          <el-select
            v-model="jiebanForm.qinwu"
            class="m-2"
            placeholder="请选择"
            style="width: 250px"
          >
            <el-option label="D勤" value="D勤" />
            <el-option label="E勤" value="E勤" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="jiebandialogVisible = false">取消</el-button>
          <el-button type="primary" @click="JiebansubmitForm(formRef)"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
  #tips {
    width: 16px;
    height: 16px;
    text-align: center;
    margin-left: 15px;
    line-height: 16px;
    border-radius: 8px;
    background-color: rgb(64, 158, 255);
    color: #ffff;
    font-size: 13px;
  }
  /* :deep .el-table .el-table__cell {
    padding-top: 0;
    margin: 0;
  } */
</style>
