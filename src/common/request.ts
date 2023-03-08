import axios from "axios"
import qs from "qs"
const instance = axios.create({
  // axios实例配置
  timeout: 60000,
  // baseURL: "http://36.139.138.80:7456",
  baseURL: "./api",
  // baseURL: "http://172.25.34.2:7456/api",
  // baseURL: "http://172.26.1.99:7456/api",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
})
// header动态赋值，因为create实例化的headers只能初始化一次
function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        token: sessionStorage.getItem("token") || "",
      },
    }
    instance
      .post(url, qs.stringify(params), config)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          // session过期
          window.location.href = location.protocol + "//" + location.host + "/login"
        }
        reject(err)
      })
  })
}

// header动态赋值，因为create实例化的headers只能初始化一次
function get(url, params = {}, look = false) {
  return new Promise((resolve, reject) => {
    const tempConfig = {
      params: params,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    }
    if (look) {
      tempConfig.responseType = "blob"
    }
    instance
      .get(url, tempConfig)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          // session过期
          window.location.href = location.protocol + "//" + location.host + "/login"
        }
        reject(err)
      })
  })
}

export default { post, get }
