<script setup lang="ts">
  import { toRefs, reactive, ref, watch } from "vue"
  import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from "element-plus"
  import request from "@/common/request"
  import dayjs from "dayjs"
  const props = defineProps({
    showDV: {
      type: Boolean,
      default: false,
    },
    reportId: {
      type: String,
      default: "",
    },
    reportList: {
      type: Object,
      default: {},
    },
  })
  const { showDV, reportId } = toRefs(props)
  const emit = defineEmits(["update:showDV", "changeshow"])
  function closeDV() {
    emit("update:showDV", false)
  }

  //这里是编辑与新增的操作
  const form = reactive({
    reportId: reportId,
    flag: "",
    name: "",
    startTime: "",
    endTime: "",
    remark: "",
  })

  const dialog = reactive({
    show: false,
    title: "新增",
  })
  function openDialog(data = "") {
    dialog.show = true
    if (data) {
      dialog.title = "编辑"

      Object.assign(form, data)
    } else {
      dialog.title = "新增"
      Object.assign(form, {
        ID: "",
        flag: "",
        name: "",
        startTime: dayjs(Date.parse(new Date()) - 60 * 60 * 1000).format("YYYY-MM-DD HH:mm:ss"),
        endTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        remark: "",
      })
    }
  }
  const formRef = ref<FormInstance>()
  const formRules = reactive<FormRules>({
    flag: [{ required: true, message: "请输入稼动标识", trigger: "blur" }],
    startTime: [{ required: true, message: "请选择稼动开始时间", trigger: "blur" }],
    endTime: [{ required: true, message: "请选择稼动结束时间", trigger: "blur" }],
  })

  const reprotByIdList = reactive({
    list: [],
  })
  //获取相对应机床的稼动损失时间详情方法
  function getJiaDongByReportId() {
    request
      .post("/operate/selectReportJd", {
        reportId: reportId.value,
        pageSize: 100,
        pageIndex: 1,
      })
      .then((data: any) => {
        reprotByIdList.list = data.list

        console.log("获取相对应机床的稼动损失时间详情方法reprotByIdList", reprotByIdList)
      })
  }
  watch(showDV, (val) => {
    //首先获取相对应机床的稼动损失时间详情
    if (val) {
      getJiaDongByReportId()
    }
  })

  //dialog新增与编辑的确认键
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        let url = ""
        if (dialog.title == "新增") {
          console.log("新增信息!")

          url = "/operate/insertReportJd"
        } else {
          console.log("编辑!")

          url = "/operate/updateReportJd"
        }
        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)
          getJiaDongByReportId()
          dialog.show = false
          ElMessage({
            type: "success",
            message: "操作成功!",
          })
        })
      }
    })
  }
  //删除操作
  function deleteData(data: any) {
    console.log("data", data)

    ElMessageBox.confirm("您要删除此条信息吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        let result = await request.post("/operate/deleteReportJd", {
          id: data.id,
        })

        ElMessage({
          type: "success",
          message: "成功删除",
        })
        getJiaDongByReportId()
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //稼动时间的校验
  let selectButtonDisabled = ref(false)

  function startTime(a: any) {
    if (Date.parse(a) > Date.parse(form.endTime)) {
      //buttonable.value = true
      selectButtonDisabled.value = true
      ElMessage({
        type: "error",
        message: "开始时间应小于结束时间",
      })
    } else {
      //  buttonable.value = false
      selectButtonDisabled.value = false
    }
  }
  function endTime(a: any) {
    if (Date.parse(a) < Date.parse(form.startTime)) {
      // buttonable.value = true
      selectButtonDisabled.value = true
      ElMessage({
        type: "error",
        message: "结束时间应大于开始时间",
      })
    } else {
      //  buttonable.value = false
      selectButtonDisabled.value = false
    }
  }
  //稼动标识与名称
  const jiadongBiaoShi = reactive([
    {
      remark: "A",
      name: "规定时间",
    },
    {
      remark: "B1",
      name: "材料不足",
    },
    {
      remark: "B2",
      name: "设备不良",
    },
    {
      remark: "C",
      name: "设备损失",
    },
    {
      remark: "D1",
      name: "材料切换",
    },
    {
      remark: "D2",
      name: "模具切换",
    },
    {
      remark: "D3",
      name: "检测时间",
    },
    {
      remark: "D4",
      name: "调整时间",
    },
    {
      remark: "E1",
      name: "材料切换",
    },
    {
      remark: "E2",
      name: "模具切换",
    },
    {
      remark: "E3",
      name: "检测时间",
    },
    {
      remark: "E4",
      name: "调整时间",
    },
    {
      remark: "E5",
      name: "待模时间",
    },
    {
      remark: "F",
      name: "计划损失",
    },
    {
      remark: "G",
      name: "技术损失",
    },
    {
      remark: "H",
      name: "实验损失",
    },
    {
      remark: "I",
      name: "行事损失",
    },
    {
      remark: "J",
      name: "制造损失",
    },
    {
      remark: "K",
      name: "其他损失",
    },
  ])
  //选择标识
  function selectBiaoShi(data: any) {
    console.log("data", data)
    jiadongBiaoShi.some((item) => {
      if (item.remark == data) {
        console.log("item选中了", item)
        form.name = item.name
        console.log(form)
      }
    })
  }
</script>
<template>
  <el-dialog v-model="showDV" title="嫁动损失时间详情" top="10vh" width="80%" @close="closeDV">
    <el-button type="primary" style="margin-bottom: 15px" @click="openDialog()">新增</el-button>
    <el-table :data="reprotByIdList.list" style="width: 95%; margin-left: 60px">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="flag" label="标识" width="180" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="danger" plain @click="deleteData(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="closeDV()">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑与新增的界面 -->
  <el-dialog v-model="dialog.show" :title="dialog.title" width="30%">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules">
      <el-form-item label="稼动标识" prop="flag">
        <el-select
          v-model="form.flag"
          class="m-2"
          placeholder="请选择"
          style="width: 250px"
          @change="selectBiaoShi"
        >
          <el-option
            v-for="item in jiadongBiaoShi"
            :label="item.remark + '(' + item.name + ')'"
            :value="item.remark"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="稼动开始时间" prop="startTime">
        <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="form.startTime"
          type="datetime"
          placeholder="请选择稼动开始时间"
          style="width: 250px"
          @change="startTime"
        />
      </el-form-item>
      <el-form-item label="稼动结束时间" prop="endTime">
        <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          v-model="form.endTime"
          type="datetime"
          placeholder="请选择稼动结束时间"
          style="width: 250px"
          @change="endTime"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :row="2" v-model="form.remark" style="width: 250px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button :disabled="selectButtonDisabled" type="primary" @click="submitForm(formRef)"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
