import { createRouter, createWebHashHistory } from "vue-router"
import BaseInfo from "../views/machine/BaseInfo.vue" // 基础信息
import HistoryStatus from "../views/machine/historyStatus/Index.vue" // 历史状态
import HistoryStatusGantt from "../views/machine/historyStatus/Gantt.vue" // 历史状态
import HistoryPlans from "../views/machine/HistoryPlans.vue" // 历史订单
import NextPlans from "../views/machine/NextPlans.vue" // 计划订单
import Asset from "../views/machine/Asset.vue" // 资产管理
import Status from "../views/machine/Status.vue" // 状态管理
import Location from "../views/machine/Location.vue" // 机床物理位置

import ReportWork from "../views/report/ReportWork.vue" // 报工
import BadProductType from "../views/report/BadProductType.vue" // 不良品类型
import ReportApprove from "@/views/report/ReportApprove.vue" // 报工审批
import BadProduct from "@/views/report/BadProduct.vue" // 不良品列表
import BadProductGl from "@/views/report/BadProductGl.vue" // 不良品管理

import CheckWork from "../views/check/Check.vue" // 点检
import PadCheck from "../views/check/PadCheck.vue" // Pad点检

import Check from "../views/board/machineCheck/Check.vue" // 点检看板
import CraneCheck from "../views/board/craneCheck/CraneCheck.vue" // 智能吊车点检看板
import Report from "../views/board/Report.vue" // 工作日报看板
import AllDevice from "../views/board/AllDevice.vue" // 车间总览看板
import DeviceNenghao from "../views/board/DeviceNenghao.vue" // 车间总览看板
import DeviceDetail from "../views/board/deviceDetail/index.vue" // 车间总览看板
import Waste from "../views/board/Waste.vue" // 废料总览
import MachineByPerson from "../views/board/MachineByPerson.vue" // 机床分布
import MachineByMonth from "@/views/board/MachineByMonth.vue"

import CCheck from "../views/crane/Check.vue" // 起重机点检
import Repair from "../views/crane/Repair.vue" // 起重机维修
import File from "../views/file/File.vue" // 文档管理
import Join from "../views/join/All.vue" // 班长交班
import Layout from "../views/Layout.vue"
import ReportWorkNew from "../views/report/ReportWorkNew.vue" //新的报工页面

import User from "../views/User.vue"
import NoUser from "../views/NoUser.vue"
import WorkPerson from "@/views/join/Person.vue"
import WorkMachine from "@/views/join/Machine.vue"
import WorkList from "@/views/join/Work.vue"
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "main",
      component: Layout,
      children: [
        {
          path: "/machine/baseinfo",
          component: BaseInfo,
        },
        {
          path: "/machine/historystatus",
          component: HistoryStatus,
        },
        {
          path: "/machine/historyStatusGantt",
          component: HistoryStatusGantt,
        },
        {
          path: "/machine/historyplans",
          component: HistoryPlans,
        },
        {
          path: "/machine/nextplans",
          component: NextPlans,
        },
        {
          path: "/machine/asset",
          component: Asset,
        },
        {
          path: "/machine/location",
          component: Location,
        },
        {
          path: "/machine/status",
          component: Status,
        },
        {
          path: "/report/reportwork",
          component: ReportWork,
        },
        {
          path: "/report/reportworknew",
          component: ReportWorkNew,
        },
        {
          path: "/report/reportapprove",
          component: ReportApprove,
        },
        {
          path: "/report/badproducttype",
          component: BadProductType,
        },
        {
          path: "/report/badproduct",
          component: BadProduct,
        },
        {
          path: "/report/badProductgl",
          component: BadProductGl,
        },
        {
          path: "/check/check",
          component: CheckWork,
        },
        {
          path: "/check/padcheck",
          component: PadCheck,
        },
        {
          path: "/crane/check",
          component: CCheck,
        },
        {
          path: "/crane/repair",
          component: Repair,
        },
        {
          path: "/board/check",
          component: Check,
        },
        {
          path: "/board/cranecheck",
          component: CraneCheck,
        },
        {
          path: "/board/report",
          component: Report,
        },
        {
          path: "/board/machinebymonth",
          component: MachineByMonth,
        },
        {
          path: "/board/alldevice",
          component: AllDevice,
        },
        {
          path: "/board/devicenenghao",
          component: DeviceNenghao,
        },
        {
          path: "/board/devicedetail",
          component: DeviceDetail,
        },
        {
          path: "/board/waste",
          component: Waste,
        },
        {
          path: "/board/machinebyperson",
          component: MachineByPerson,
        },
        {
          path: "/file/file",
          component: File,
        },
        {
          path: "/join",
          component: Join,
        },
        {
          path: "/user",
          component: User,
        },
      ],
    },
    {
      path: "/nouser",
      name: "NoUser",
      component: NoUser,
    },
    {
      path: "/app/workperson",
      name: "WorkPerson",
      component: WorkPerson,
    },
    {
      path: "/app/workmachine",
      name: "WorkMachine",
      component: WorkMachine,
    },
    {
      path: "/app/worklist",
      name: "WorkList",
      component: WorkList,
    },
    {
      path: "/app/machineCheck",
      name: "PadCheck",
      component: PadCheck,
    },
  ],
})

export default router
