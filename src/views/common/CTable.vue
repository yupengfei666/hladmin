<script lang="ts" setup>
  import { toRefs, ref, watch, reactive, computed, onMounted, nextTick } from "vue"
  import { ElMessageBox } from "element-plus"
  import { ElMessage } from "element-plus"
  import request from "../../common/request"
  import _ from "lodash-es"
  const props = defineProps({
    tableId: {
      type: String,
      default: "out-table",
    },
    queryNow: {
      type: Boolean,
      default: false,
    },
    tableItem: {
      // 表格头，如果不传默认获取第一行数据的键值,父组件需要考虑查询数据为0的情况，数据为0 表格不渲染，需要手动写空状态展示
      type: Array,
      default: function () {
        return []
      },
    },

    testData: {
      type: Array,
      default: () => [],
    },
    operateWidth: {
      // 操作列宽度
      type: Number,
      default: 160,
    },
    queryApi: {
      type: String,
      default: "",
    },
    deleteApi: {
      type: String,
      default: "",
    },
    queryParams: {
      // 查询参数
      type: Array,
      default: function () {
        return []
      },
    },
    isOperate: {
      // 是否显示操作列
      type: Boolean,
      default: true,
    },
    isEditAndDelete: {
      // 是否显示操作列中的编辑和删除
      type: Boolean,
      default: false,
    },
  })
  const {
    tableId,
    queryNow,
    tableItem,
    operateWidth,
    testData,
    isOperate,
    isEditAndDelete,
    queryApi,
    queryParams,
    deleteApi,
  } = toRefs(props)
  const emit = defineEmits([
    "doData",
    "editItem",
    "update:queryNow",
    "selectChange",
    "showAssetsManagement",
  ])
  const tableData = ref<any>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSizeArr = [10, 20, 50, 100, 500]
  const pageSize = ref(pageSizeArr[0])

  const total = ref(0)
  function indexMethod(index: number) {
    return (currentPage.value - 1) * pageSize.value + index + 1
  }
  const tableHead = ref<any>([])
  onMounted(() => {
    if (queryNow.value) {
      getList()
    }
  })
  watch(queryNow, (val) => {
    if (val) {
      getList()
    }
  })
  async function getList() {
    tableHead.value = tableItem.value

    if (testData.value.length > 0) {
      tableData.value = _.slice(
        testData.value,
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
      )
      total.value = testData.value.length
    } else {
      const p = {
        pageIndex: currentPage.value,
        pageSize: pageSize.value,
      }
      for (const item of queryParams.value) {
        p[item.key] = item.value
      }

      loading.value = true
      const res: any = await request.post(queryApi.value, p)
      total.value = res.total
      tableData.value = res.list
      loading.value = false
    }

    emit("doData", tableData.value)
    emit("update:queryNow", false)
  }
  function deleteItem(id: number | string) {
    console.log(444)
    console.log(id)

    ElMessageBox.confirm("您确认删除此条数据吗", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(async () => {
      const p = {
        id: id,
      }
      await request.post(deleteApi.value, p)
      getList()
      ElMessage({
        type: "success",
        message: "删除成功!",
      })
    })
  }
</script>
<template>
  <main>
    <el-table
      :id="tableId"
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      row-key="ID"
      :tree-props="{ children: 'leaf' }"
      :row-style="{ height: '50px' }"
      :cell-style="{ padding: '0px' }"
    >
      <el-table-column
        fixed
        type="index"
        width="70"
        label="序号"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column
        v-for="item in tableHead"
        :key="item.prop"
        :prop="item.prop"
        :show-overflow-tooltip="true"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
      >
        <template #default="scope">
          <span :style="scope.row[item.prop + '_style']">
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isOperate"
        prop="操作"
        label="操作"
        fixed="right"
        :width="operateWidth"
      >
        <template #default="scope">
          <slot :scope="scope">
            <el-button type="primary" plain @click="$emit('editItem', scope.row)">编辑</el-button>
            <el-button type="danger" plain @click="deleteItem(scope.row.id)">删除</el-button>
          </slot>
          <span v-if="isEditAndDelete">
            <el-button type="primary" plain @click="$emit('editItem', scope.row)">编辑</el-button>
            <el-button type="danger" plain @click="deleteItem(scope.row.id)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center; margin-top: 10px">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="pageSizeArr"
        background
        @current-change="getList()"
        @size-change="getList()"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </main>
</template>
