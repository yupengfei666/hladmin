<script setup lang="ts">
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import type { FormInstance, FormRules } from "element-plus"
  import request from "../../common/request"
  import { ElMessageBox, ElMessage } from "element-plus"
  import { log } from "console"
  console.log(4)

  onMounted(async () => {
    getStatus()
  })
  const dataall = reactive({
    list: [],
  })

  const queryNow = ref(false)
  onMounted(() => {
    queryNow.value = true
  })
  const formHead = reactive({
    name: "",
  })

  function deletemessage(data: any) {
    console.log("data", data)

    ElMessageBox.confirm("您要删除此条状态吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        let result = await request.post("/machine/deleteStatus", { id: data.id })
        getStatus()
        ElMessage({
          type: "success",
          message: "成功删除",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //编辑的页面
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    name: "",
    color: "",
    colorCode: "",
    isError: "",
    flag: "",
  })
  function openDrawer(data = "") {
    drawer.show = true
    console.log(data)
    if (data) {
      drawer.title = "编辑"
      Object.assign(form, data)
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        name: "",
        color: "",
        colorCode: "",
        isError: "",
        flag: "",
      })
    }
  }
  const formRef = ref<FormInstance>()
  const formRules = reactive<FormRules>({
    name: [{ required: true, message: "请输入状态名称", trigger: "blur" }],
    color: [{ required: true, message: "请输入状态颜色", trigger: "blur" }],
    colorCode: [{ required: true, message: "请输入状态颜色代码", trigger: "blur" }],
    isError: [{ required: true, message: "请输入状态颜色代码", trigger: "blur" }],
  })
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid) => {
      if (valid) {
        console.log("新增信息!")
        let url = ""
        if (drawer.title == "新增") {
          url = "/machine/insertStatus"
        } else {
          url = "/machine/updateStatus"
        }
        console.log("form", form)

        request.post(url, form).then((data) => {
          console.log("更新/新增成功之后返回的接口", data)
          getStatus()
          drawer.show = false
          ElMessage({
            type: "success",
            message: "操作成功!",
          })
        })
      }
    })
  }

  //获取数据库的状态
  let data = {
    name: "",
    pageIndex: 1,
    pageSize: 100,
  }

  const alldata = reactive({
    list: [],
  })
  async function getStatus() {
    let result: any = await request.post("/machine/selectStatus", data)

    console.log("result", result)

    dataall.list = result.list

    console.log("dataall.list", dataall.list)

    return result
  }
  function selectColor(value) {
    console.log("value", value)
    form.colorCode = value
  }

  const colorDate = reactive([
    {
      color: "#e10f71",
      colorName: "红色",
    },
    {
      color: "#45b23d",
      colorName: "绿色",
    },
    {
      color: "#e07a30",
      colorName: "黄色",
    },
    {
      color: "#767171",
      colorName: "灰色",
    },
    {
      color: "#ff6100",
      colorName: "橙色",
    },
    {
      color: "#00ffff",
      colorName: "青色",
    },
    {
      color: "#9933FA",
      colorName: "湖紫色",
    },
    {
      color: "#da70d6",
      colorName: "淡紫色",
    },
    {
      color: "#f0e68c",
      colorName: "黄褐色",
    },
    {
      color: "#000000",
      colorName: "黑色",
    },
    {
      color: "#9C661F",
      colorName: "砖红",
    },
    {
      color: "#03A89E",
      colorName: "锰蓝",
    },
    {
      color: "#BC8F8F",
      colorName: "玫瑰红",
    },
    {
      color: "#C76114",
      colorName: "肖贡土色",
    },
    {
      color: "#F4A460",
      colorName: "沙棕色",
    },
    {
      color: "#666666",
      colorName: "象牙黑",
    },
    {
      color: "#808069",
      colorName: "暖灰",
    },
    {
      color: "#FFC0CB",
      colorName: "粉红",
    },
    {
      color: "#E6E6E6",
      colorName: "石板灰",
    },
    {
      color: "#FFD700",
      colorName: "金黄",
    },
    {
      color: "#FF7D40",
      colorName: "肉黄",
    },
    {
      color: "#FF7F50",
      colorName: "珊瑚红",
    },
    {
      color: "#6B8E23",
      colorName: "草绿色",
    },
    {
      color: "#FF00FF",
      colorName: "深红",
    },
  ])
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
      </el-form-item>
      <el-form-item> </el-form-item>
    </el-form>
  </header>
  <main>
    <el-scrollbar height="800px">
      <el-table :data="dataall.list" style="width: 100%">
        <el-table-column type="index" width="80" label="序号" />
        <el-table-column prop="name" label="状态名称" />
        <el-table-column prop="flag" label="标识" />
        <el-table-column prop="isError" label="展示名称" />
        <el-table-column prop="color" label="状态颜色">
          <template #default="scope">
            <div :style="{ backgroundColor: scope.row.colorCode }" class="circle"> </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              :disabled="
                scope.row.id == '4379cbbc-de44-418e-82f6-1848f44f0404' ||
                scope.row.id == '88a6b06a-6faf-4b73-bcc8-37456d37acad' ||
                scope.row.id == '2b72e179-4655-4d5a-aed0-135c991a8a6a' ||
                scope.row.id == '4ab34cca-19bc-4053-a5c4-700f8837a58e'
              "
              plain
              @click="openDrawer(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              plain
              @click="deletemessage(scope.row)"
              :disabled="
                scope.row.id == '4379cbbc-de44-418e-82f6-1848f44f0404' ||
                scope.row.id == '88a6b06a-6faf-4b73-bcc8-37456d37acad' ||
                scope.row.id == '2b72e179-4655-4d5a-aed0-135c991a8a6a' ||
                scope.row.id == '4ab34cca-19bc-4053-a5c4-700f8837a58e'
              "
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </main>
  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show" :size="500">
      <el-form ref="formRef" :model="form" label-width="110px" :rules="formRules">
        <el-form-item label="状态名称" prop="name">
          <el-input v-model="form.name" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item label="状态颜色" prop="color">
          <el-select v-model="form.color" class="m-2" placeholder="请选择" @change="selectColor">
            <el-option v-for="item in colorDate" :label="item.colorName" :value="item.color">
              <div
                :style="{
                  height: '10px',
                  width: '10px',
                  backgroundColor: item.color,
                  borderRadius: '10px',
                  display: 'inline-block',
                }"
              ></div
              >&nbsp;<span>{{ item.colorName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="form.flag" style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item label="展示名称" prop="isError">
          <el-select v-model="form.isError" class="m-2" placeholder="请选择">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </aside>
</template>
<style scoped>
  .circle {
    width: 20px;
    height: 20px;
    margin-left: 15px;
    border-radius: 10px;
  }
</style>
