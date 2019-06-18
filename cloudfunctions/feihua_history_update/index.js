// 更新数据 - update 成语接龙的排名
// 当数据库中不存在openid字段，当更新这个数据表时，系统会认为不是创建者，在小程序端也就更新不了，只有通过云函数更新
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {

  const { database, id, data} = event
  console.log(event)

  try {
    return await db.collection(database).doc(id)
      .update({
        data
      })
  } catch (e) {
    console.error(e)
  }
}

