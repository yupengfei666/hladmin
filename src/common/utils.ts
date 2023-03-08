import FileSaver from "file-saver"
import * as XLSX from "xlsx"

function exportExcel(tableId, fileName, removeFixed = 1, lastColumn = false) {
  // 由于增加了fixed固定列，所有多了个table， 解决原理先移除再append进去
  const fixLeft = document.querySelector(".el-table__fixed")
  const fixRight = document.querySelector(".el-table__fixed-right")
  const id = tableId
  let wb
  // raw: 数据是否加工，默认false自动加工
  /* 从表生成工作簿对象 */
  if (removeFixed && (fixLeft || fixRight)) {
    if (fixLeft) {
      wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fixLeft), { raw: true })
      document.querySelector(id).appendChild(fixLeft)
    } else {
      wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fixRight), { raw: true })
      document.querySelector(id).appendChild(fixRight)
    }
  } else {
    wb = XLSX.utils.table_to_book(document.querySelector(id), { raw: true })
  }
  // 去掉最后一行操作列
  // ------start-------
  const ws = wb.Sheets.Sheet1
  const range = XLSX.utils.decode_range(ws["!ref"])
  range.e.c = lastColumn ? range.e.c : range.e.c - 1
  ws["!ref"] = XLSX.utils.encode_range(range.s, range.e)
  // -------end------
  /* 获取二进制字符串作为输出 */
  const wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  })
  console.log(5555)
  console.log(fileName)
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      // 设置导出文件名称
      fileName + ".xlsx"
    )
  } catch (e) {
    if (typeof console !== "undefined") console.log(e, wbout)
  }
  return wbout
}

export { exportExcel }
