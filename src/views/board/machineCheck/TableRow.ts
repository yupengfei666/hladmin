// 数据前4行
const initTableRow = [
  {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "设备点检表",
    a6: "",
    a7: "",
    a8: "",
    a9: "2022年61月",
    a10: "",
    a11: "",
    a12: "机床号:",
    a13: "",
    a14: "1",
    a15: "",
    a16: "",
    a17: "",
    a18: "",
    a19: "",
    a20: "",
    a21: "",
    a22: "",
    a23: "",
    a24: "",
    a25: "",
    a26: "",
    a27: "",
    a28: "",
    a29: "",
    a30: "",
    a31: "",
    a32: "",
    a33: "",
    a34: "",
    a35: "",
    a36: "",
    a37: "",
    a38: "",
    a39: "",
    a40: "",
    a41: "",
    a42: "",
    a43: "",
    a44: "",
    a45: "",
    a46: "",
    a47: "",
    a48: "",
    a49: "",
    a50: "",
    a51: "",
    a52: "",
    a53: "",
    a54: "",
    a55: "",
    a56: "",
    a57: "",
    a58: "",
    a59: "",
    a60: "",
  },
  {
    a1: "适用范围：",
    a2: "1",
    a3: "1",
    a4: "FANUC成型机及其附属设备",
    a5: "",
    a6: "",
    a7: "",
    a8: "",
    a9: "",
    a10: "",
    a11: "",
    a12: "",
    a13: "",
    a14: "",
    a15: "",
    a16: "",
    a17: "",
    a18: "",
    a19: "",
    a20: "",
    a21: "",
    a22: "",
    a23: "",
    a24: "",
    a25: "",
    a26: "",
    a27: "",
    a28: "",
    a29: "",
    a30: "",
    a31: "",
    a32: "",
    a33: "",
    a34: "",
    a35: "",
    a36: "",
    a37: "",
    a38: "",
    a39: "",
    a40: "",
    a41: "",
    a42: "",
    a43: "",
    a44: "",
    a45: "",
    a46: "",
    a47: "",
    a48: "",
    a49: "",
    a50: "",
    a51: "",
    a52: "",
    a53: "",
    a54: "",
    a55: "",
    a56: "",
    a57: "",
    a58: "",
    a59: "",
    a60: "",
  },
  {
    a1: "点检内容",
    a2: "",
    a3: "",
    a4: "点检频次",
    a5: "1",
    a6: "",
    a7: "2",
    a8: "",
    a9: "3",
    a10: "",
    a11: "4",
    a12: "",
    a13: "5",
    a14: "",
    a15: "6",
    a16: "",
    a17: "7",
    a18: "",
    a19: "8",
    a20: "",
    a21: "9",
    a22: "",
    a23: "10",
    a24: "",
    a25: "11",
    a26: "",
    a27: "12",
    a28: "",
    a29: "13",
    a30: "",
    a31: "14",
    a32: "",
    a33: "15",
    a34: "",
    a35: "16",
    a36: "",
    a37: "17",
    a38: "",
    a39: "18",
    a40: "",
    a41: "19",
    a42: "",
    a43: "20",
    a44: "",
    a45: "21",
    a46: "",
    a47: "22",
    a48: "",
    a49: "23",
    a50: "",
    a51: "24",
    a52: "",
    a53: "25",
    a54: "",
    a55: "26",
    a56: "",
    a57: "27",
    a58: "",
    a59: "28",
    a60: "",
  },
  {
    a1: "",
    a2: "",
    a3: "",
    a4: "",
    a5: "D",
    a6: "E",
    a7: "D",
    a8: "E",
    a9: "D",
    a10: "E",
    a11: "D",
    a12: "E",
    a13: "D",
    a14: "E",
    a15: "D",
    a16: "E",
    a17: "D",
    a18: "E",
    a19: "D",
    a20: "E",
    a21: "D",
    a22: "E",
    a23: "D",
    a24: "E",
    a25: "D",
    a26: "E",
    a27: "D",
    a28: "E",
    a29: "D",
    a30: "E",
    a31: "D",
    a32: "E",
    a33: "D",
    a34: "E",
    a35: "D",
    a36: "E",
    a37: "D",
    a38: "E",
    a39: "D",
    a40: "E",
    a41: "D",
    a42: "E",
    a43: "D",
    a44: "E",
    a45: "D",
    a46: "E",
    a47: "D",
    a48: "E",
    a49: "D",
    a50: "E",
    a51: "D",
    a52: "E",
    a53: "D",
    a54: "E",
    a55: "D",
    a56: "E",
    a57: "D",
    a58: "E",
    a59: "D",
    a60: "E",
  },
]
export function tableHeadF(month: string, machineName: string, dayTotal: number) {
  const tableRow = JSON.parse(JSON.stringify(initTableRow))
  tableRow[0].a9 = month
  tableRow[0].a14 = machineName
  switch (dayTotal) {
    case 29:
      tableRow[0].a61 = ""
      tableRow[0].a62 = ""
      tableRow[1].a61 = ""
      tableRow[1].a62 = ""
      tableRow[2].a61 = "29"
      tableRow[2].a62 = ""
      tableRow[3].a61 = "D"
      tableRow[3].a62 = "E"
      break
    case 30:
      tableRow[0].a61 = ""
      tableRow[0].a62 = ""
      tableRow[0].a63 = ""
      tableRow[0].a64 = ""
      tableRow[1].a61 = ""
      tableRow[1].a62 = ""
      tableRow[1].a63 = ""
      tableRow[1].a64 = ""
      tableRow[2].a61 = "29"
      tableRow[2].a62 = ""
      tableRow[2].a63 = "30"
      tableRow[2].a64 = ""
      tableRow[3].a61 = "D"
      tableRow[3].a62 = "E"
      tableRow[3].a63 = "D"
      tableRow[3].a64 = "E"
      break
    case 31:
      tableRow[0].a61 = ""
      tableRow[0].a62 = ""
      tableRow[0].a63 = ""
      tableRow[0].a64 = ""
      tableRow[0].a65 = ""
      tableRow[0].a66 = ""
      tableRow[1].a61 = ""
      tableRow[1].a62 = ""
      tableRow[1].a63 = ""
      tableRow[1].a64 = ""
      tableRow[1].a65 = ""
      tableRow[1].a66 = ""
      tableRow[2].a61 = "29"
      tableRow[2].a62 = ""
      tableRow[2].a63 = "30"
      tableRow[2].a64 = ""
      tableRow[2].a65 = "31"
      tableRow[2].a66 = ""
      tableRow[3].a61 = "D"
      tableRow[3].a62 = "E"
      tableRow[3].a63 = "D"
      tableRow[3].a64 = "E"
      tableRow[3].a65 = "D"
      tableRow[3].a66 = "E"
      break
    default:
      break
  }
  return tableRow
}
