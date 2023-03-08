<script setup lang="ts">
  import CTable from "../common/CTable.vue"
  import { reactive, onMounted, ref } from "vue"
  import ExportExcelButton from "../common/ExportExcelButton.vue"
  import { ElMessage, type FormInstance, type FormRules, ElMessageBox } from "element-plus"
  import MachineSelect from "../common/MachineSelect.vue"
  import request from "../../common/request"
  import { log } from "console"
  console.log(4)
  const tableItem = [
    {
      prop: "name",
      label: "机床号",
      fixed: true,
    },
    {
      prop: "type",
      label: "型号",
      width: 120,
    },
    {
      prop: "tons",
      label: "吨位",
    },
    // {
    //   prop: "productionPlan",
    //   label: "生产计划",
    // },
    // {
    //   prop: "statusName",
    //   label: "状态",
    // },

    {
      prop: "assetClassification",
      label: "资产分类",
    },
    {
      prop: "responsible",
      label: "责任者",
    },
    {
      prop: "useDepartment",
      label: "使用部门",
    },
    {
      prop: "assetId",
      label: "资产编号",
      width: 120,
    },
    {
      prop: "assetName",
      label: "资产名称",
      width: "180",
    },
    {
      prop: "serviceCondition",
      label: "使用状况",
    },
    {
      prop: "site",
      label: "设置场所",
      width: "100",
    },
    {
      prop: "buildingModel",
      label: "建筑样式/型号",
      width: 120,
    },
    {
      prop: "originalPrice",
      label: "原价",
      width: "110",
    },
    {
      prop: "depreciationAmount",
      label: "累计折旧额",
      width: "110",
    },
    {
      prop: "netWorth",
      label: "2019年11月末净值",
      width: 110,
    },
    {
      prop: "accumulatedDepreciation",
      label: "原价(T/B) 2012年始累计折旧折旧额/月",
      width: "120",
    },
    {
      prop: "assetStartDate",
      label: "资产始用日期",
      width: "120",
    },
    {
      prop: "supplier",
      label: "供应商",
      width: 170,
    },

    {
      prop: "describment",
      label: "描述",
    },
    {
      prop: "placeArea",
      label: "放置区域",
    },
  ]
  const queryNow = ref(false)
  const token = sessionStorage.getItem("token")
  const queryParams = ref([])
  onMounted(() => {
    getMechine()
    getMember()
  })
  const formHead = reactive({
    name: "",
    id: "",
    assetClassification: "",
    type: "",
    tons: "",
    responsible: "",
    isScrap: "",
  })
  const Member = reactive({
    list: [],
  })

  //这里是编辑界面的操作逻辑
  const drawer = reactive({
    show: false,
    title: "新增",
  })
  const form = reactive({
    ID: "",
    name: "",
    type: "",

    productionPlan: "",
    status: "",
    tons: "",
    useDepartment: "",
    assetClassification: "",
    assetId: "",
    serviceCondition: "",
    assetName: "",
    site: "",
    buildingModel: "",
    originalPrice: "",
    depreciationAmount: "",
    netWorth: "",
    accumulatedDepreciation: "",
    assetStartDate: "",
    supplier: "",
    responsible: "",
    describment: "",
    placeArea: "",
    machineId: "",
  })
  function openDrawer(data = "") {
    drawer.show = true
    console.log("data", data)
    if (data) {
      drawer.title = "编辑"
      Object.assign(form, data)
      console.log("编辑的from", form)
    } else {
      drawer.title = "新增"
      Object.assign(form, {
        ID: "",
        name: "",
        type: "",

        productionPlan: "",
        status: "",
        tons: "",
        useDepartment: "",
        assetClassification: "",
        assetId: "",
        serviceCondition: "",
        assetName: "",
        site: "",
        buildingModel: "",
        originalPrice: "",
        depreciationAmount: "",
        netWorth: "",
        accumulatedDepreciation: "",
        assetStartDate: "",
        supplier: "",
        responsible: "",
        describment: "",
        placeArea: "",
        machineId: "",
      })
    }
  }
  const formRules = reactive<FormRules>({
    machineId: [{ required: true, message: "请输入机床名", trigger: "blur" }],
    useDepartment: [{ required: true, message: "请输入使用部门", trigger: "blur" }],
    assetClassification: [{ required: true, message: "请输入资产分类", trigger: "blur" }],
    assetId: [{ required: true, message: "请输入资产编号", trigger: "blur" }],
    assetName: [{ required: true, message: "请输入资产名称", trigger: "blur" }],
    serviceCondition: [{ required: true, message: "请输入使用状况", trigger: "blur" }],
    site: [{ required: true, message: "请输入设置场所", trigger: "blur" }],
    buildingModel: [{ required: true, message: "请输入建筑样式/型号", trigger: "blur" }],
    originalPrice: [{ required: true, message: "请输入原价", trigger: "blur" }],
    depreciationAmount: [{ required: true, message: "请输入累计折旧额", trigger: "blur" }],
    netWorth: [{ required: true, message: "请输入2019年11月末净值", trigger: "blur" }],
    accumulatedDepreciation: [
      { required: true, message: "请输入2012年始累计折旧额", trigger: "blur" },
    ],
    assetStartDate: [{ required: true, message: "请输入资产始用日期", trigger: "blur" }],
    supplier: [{ required: true, message: "请输入供应商", trigger: "blur" }],
    responsible: [{ required: true, message: "请选择责任者", trigger: "blur" }],
    describment: [{ required: true, message: "请输入描述", trigger: "blur" }],
    placeArea: [{ required: true, message: "请输入放置区域", trigger: "blur" }],
    name: [{ required: true, message: "请输入机床名称", trigger: "blur" }],
    type: [{ required: true, message: "请输入型号", trigger: "blur" }],
    brand: [{ required: true, message: "请输入品牌", trigger: "blur" }],
    productionPlan: [{ required: true, message: "请输入生产计划", trigger: "blur" }],
    tons: [{ required: true, message: "请输入吨位", trigger: "blur" }],
    newStatus: [{ required: true, message: "请选择状态", trigger: "blur" }],
  })
  const formRef = ref<FormInstance>()
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    await formEl.validate((valid) => {
      if (valid) {
        console.log("submit!")
        let url = ""
        if (drawer.title == "新增") {
          url = "/machine/insertBaseInfo"
          console.log("新增")
        } else {
          url = "/machine/updateAsset"
          console.log("更新")
        }
        console.log("form", form)

        request.post(url, form).then((resolve: any) => {
          console.log("更新/新增成功之后返回的接口", resolve)
          if (resolve.code == 0) {
            ElMessage.error("已存在此机床号，不允许重复添加")
            queryNow.value = true
            getMechine()
          } else {
            queryNow.value = true
            getMechine()
            drawer.show = false
            ElMessage({
              type: "success",
              message: "添加成功!",
            })
          }
        })
      }
    })
  }
  //查询功能
  function SelectMachineByMachineId(data: any) {
    formHead.id = data.id
    console.log("data", data)

    console.log("formHead", formHead)
  }
  function selectbyid() {
    console.log("formHead.name", formHead.name)

    queryParams.value = [
      {
        key: "id",
        value: formHead.id,
      },
      {
        key: "assetClassification",
        value: formHead.assetClassification,
      },
      {
        key: "type",
        value: formHead.type,
      },
      {
        key: "tons",
        value: formHead.tons,
      },
      {
        key: "responsible",
        value: formHead.responsible,
      },
      {
        key: "isScrap",
        value: formHead.isScrap,
      },
    ]
    queryNow.value = true
    ElMessage({
      type: "success",
      message: "查询成功",
    })
  }
  //在这里查询所有没有资产的机床号
  const mechineAllWithNoAsset = reactive({
    list: [],
  })
  async function getMechine() {
    const result: any = await request.post("/machine/selectNoAssetMachine", {
      name: "",
      pageIndex: 1,
      pageSize: 1000,
    })
    queryNow.value = true
    console.log("asset")
    queryParams.value = [
      {
        key: "name",
        value: "",
      },
    ]
    mechineAllWithNoAsset.list = result.list
    console.log("mechineAllWithNoAsset", mechineAllWithNoAsset)
  }

  //删除操作
  function deleteByMachineId(data) {
    console.log(data)
    ElMessageBox.confirm("您确认删除此条数据吗", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request
          .post("/machine/deleteAsset", { machineId: data.machineId, id: data.id })
          .then((data) => {
            console.log("删除操作", data)
            queryNow.value = true
            getMechine()
          })

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
  //下拉框选择机床

  function SelectMachineByMachineIdEditOrInset(data: any) {
    console.log("data", data)
    form.machineId = data.id
  }

  //报废操作
  function baofei(data: any) {
    console.log("报废操作")
    ElMessageBox.confirm("您确认将此资产报废吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request
          .post("/machine/updateIsScrap", { id: data.id, isScrap: "是" })
          .then((data) => {
            console.log("报废操作", data)
            queryNow.value = true
            getMechine()
          })
        ElMessage({
          type: "success",
          message: "报废成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }
  //启用操作
  function qiyong(data: any) {
    console.log("启用操作")
    ElMessageBox.confirm("您确认将此资产启用吗", "Warning", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await request
          .post("/machine/updateIsScrap", { id: data.id, isScrap: "否" })
          .then((data) => {
            console.log("启用操作", data)
            queryNow.value = true
            getMechine()
          })
        ElMessage({
          type: "success",
          message: "启用成功",
        })
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        })
      })
  }

  //责任人列表
  function getMember() {
    request.post("/machine/selectPerson", { token: token, name: "" }).then((data: any) => {
      console.log("查询人员列表", data)
      Member.list = data.list
    })
  }
</script>

<template>
  <header class="form-head">
    <el-form :inline="true" :model="formHead">
      <el-form-item label="机床号">
        <MachineSelect
          style="width: 180px"
          :selected-first="false"
          :is-include-scrap="true"
          @selected-item="SelectMachineByMachineId"
        >
        </MachineSelect>
      </el-form-item>
      <el-form-item label="资产分类">
        <el-select
          v-model="formHead.assetClassification"
          style="width: 180px"
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option label="成型机" value="成型机" />
          <el-option label="干燥机" value="干燥机" />
          <el-option label="温调机" value="温调机" />
          <el-option label="粉碎机" value="粉碎机" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="型号">
        <el-input style="width: 180px" v-model="formHead.type" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="吨位">
        <el-input style="width: 180px" v-model="formHead.tons" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="责任人">
        <el-select
          v-model="formHead.responsible"
          class="m-2"
          style="width: 180px"
          clearable
          filterable
          placeholder="请选择责任人"
        >
          <el-option
            v-for="item in Member.list"
            :label="item.name"
            :value="item.account"
            :key="item.account"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否报废">
        <el-select
          v-model="formHead.isScrap"
          class="m-2"
          style="width: 180px"
          clearable
          placeholder="请选择"
        >
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectbyid">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openDrawer()">新增</el-button>
        <ExportExcelButton fileName="资产管理"></ExportExcelButton>
      </el-form-item>
    </el-form>
  </header>
  <main>
    <CTable
      :tableItem="tableItem"
      v-model:queryNow="queryNow"
      @edit-item="openDrawer"
      query-api="/machine/getAsset"
      :query-params="queryParams"
      deleteApi="/machine/deleteAsset"
      #default="{ scope }"
      :operate-width="230"
    >
      <el-button type="warning" palin v-if="scope.row.isScrap == '否'" @click="baofei(scope.row)"
        >报废</el-button
      >
      <el-button type="success" palin v-if="scope.row.isScrap == '是'" @click="qiyong(scope.row)"
        >启用</el-button
      >
      <el-button
        type="primary"
        :disabled="scope.row.isScrap == '是'"
        palin
        @click="openDrawer(scope.row)"
        >编辑</el-button
      >
      <el-button
        type="danger"
        :disabled="scope.row.isScrap == '是'"
        palin
        @click="deleteByMachineId(scope.row)"
        plain
        >删除</el-button
      >
    </CTable>
  </main>

  <aside>
    <!-- 这里是编辑的右滑框 -->
    <el-drawer :title="drawer.title" v-model="drawer.show">
      <el-scrollbar>
        <el-form ref="formRef" :model="form" label-width="200px" :rules="formRules">
          <!-- <el-form-item label="机床号" prop="machineId">
            <el-select
              style="width: 250px"
              v-model="form.machineId"
              clearable
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in mechineAllWithNoAsset.list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="机床号" prop="name">
            <el-input v-model="form.name" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="型号" prop="type">
            <el-input v-model="form.type" style="width: 250px"></el-input>
          </el-form-item>

          <!-- <el-form-item label="品牌" prop="brand">
            <el-input v-model="form.brand" style="width: 250px"></el-input>
          </el-form-item> -->

          <el-form-item label="吨位" prop="tons">
            <el-input v-model="form.tons" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="responsible">
            <!-- <el-input v-model="form.responsible" style="width: 250px"></el-input> -->
            <el-select
              v-model="form.responsible"
              class="m-2"
              filterable
              style="width: 250px"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in Member.list"
                :label="item.name"
                :value="item.account"
                :key="item.account"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资产分类" prop="assetClassification">
            <el-select
              v-model="form.assetClassification"
              placeholder="请选择资产分类"
              style="width: 250px"
            >
              <el-option label="成型机" value="成型机" />
              <el-option label="干燥机" value="干燥机" />
              <el-option label="温调机" value="温调机" />
              <el-option label="粉碎机" value="粉碎机" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="使用部门">
            <el-input v-model="form.useDepartment" style="width: 250px"></el-input>
          </el-form-item>

          <el-form-item label="资产编号">
            <el-input v-model="form.assetId" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="资产名称">
            <el-input v-model="form.assetName" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="使用状况">
            <el-input v-model="form.serviceCondition" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="设置场所">
            <el-input v-model="form.site" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="建筑样式/型号">
            <el-input v-model="form.buildingModel" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="原价">
            <el-input v-model="form.originalPrice" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="累计折旧额">
            <el-input v-model="form.depreciationAmount" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="2019年11月末净值">
            <el-input v-model="form.netWorth" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="2012年始累计折旧折旧额">
            <el-input v-model="form.accumulatedDepreciation" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="资产始用日期">
            <el-date-picker
              v-model="form.assetStartDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择资产始用日期"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="供应商">
            <el-input v-model="form.supplier" style="width: 250px"></el-input>
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="form.describment" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="放置区域">
            <el-input v-model="form.placeArea" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-drawer>
  </aside>
</template>
