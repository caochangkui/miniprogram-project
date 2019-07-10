// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  const { a, b } = event
  const { OPENID, APPID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  const sum = a + b

  return {
    OPENID,
    APPID,
    sum
  }
}
