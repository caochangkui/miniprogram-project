// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {a, b} = event

  const sum = a + b

  console.log(event)
  console.log(context) 

  return {
    sum
  }
}