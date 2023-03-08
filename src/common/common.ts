/*
 * @Author: zhangchen
 * @Date: 2022-11-09 09:32:57
 * @LastEditTime: 2022-11-18 14:51:20
 */
import request from "./request"
import _ from "lodash-es"
import dayjs from "dayjs"

// 定时同步 临时人员（操作，加工）到 正式机床
async function replacePersonToProdue() {
  await request.post("work/updateMechineBaseInfo")
}

// 考虑到app外部引用，会传入 token和classname
async function getPersonList(token = "", className = "") {
  const personTemp = {
    [role.jiaoti]: {
      key: role.jiaoti,
      value: [],
    },
    [role.caozuo]: {
      key: role.caozuo,
      value: [],
    },
    [role.jiagong]: {
      key: role.jiagong,
      value: [],
    },
  }
  const currentClass = className
    ? className
    : JSON.parse(sessionStorage.getItem("currentUser") as string).class
  const tokenP = token ? token : sessionStorage.getItem("token")
  const p = {
    token: tokenP,
    className: currentClass,
    current: 1,
    size: 100,
  }
  const res: any = await request.post("RiJia/selectCurrentClass", p)
  for (const item of res.list) {
    if (personTemp[item.roleName]) {
      personTemp[item.roleName].value.push(item)
    }
  }
  return Object.values(personTemp)
}

const role = {
  jiaoti: "交替",
  caozuo: "机床操作员",
  jiagong: "加工",
  banzhang: "班长",
}

async function getAllPerson() {
  const result: any = await request.post("/machine/selectPerson", {
    token: sessionStorage.getItem("token"),
  })

  return result.list
}

async function getPinFan() {
  return await request.post("/machine/selectPinfan")
}

async function getMianShu() {
  return await request.post("/machine/selectMianshu")
}
/**
 * 根据MouldDetail返回品番，多个返回品番+
 * @param data
 * @returns
 */
function getCategorysByMouldDetail(data, showAll = false) {
  data = JSON.parse(data || "[]")
  const mouldTemp = _.uniq(_.map(data, "category_name")).join()
  if (showAll) {
    return mouldTemp
  }
  const tempA = mouldTemp.split(",")
  if (tempA.length > 1) {
    return tempA[0] + "+"
  } else {
    return mouldTemp
  }
}
/**
 * 返回当前时间的日期和勤务
 */
function getCurrentDayAndQinwu() {
  const timeHour = dayjs().format("HH")
  let timeDay = dayjs().format("YYYY-MM-DD")
  const result = {
    date: "",
    qinwu: "",
    startTime: "",
    endTime: "",
    currentDate: dayjs().format("YYYY-MM-DD"), // 当前时间
  }
  // D勤
  if (timeHour > "07" && timeHour < "20") {
    result.qinwu = "D勤"
    result.startTime = "08:00:00"
    result.endTime = "19:59:59"
  } else {
    // E勤
    result.qinwu = "E勤"
    result.startTime = "20:00:00"
    result.endTime = "07:59:59"
    // 如果是当前8点前取昨天日期
    if (timeHour < "07") {
      timeDay = dayjs().subtract(1, "day").format("YYYY-MM-DD")
    }
  }
  result.date = timeDay
  return result
}

export {
  replacePersonToProdue,
  role,
  getPersonList,
  getAllPerson,
  getPinFan,
  getMianShu,
  getCategorysByMouldDetail,
  getCurrentDayAndQinwu,
}
