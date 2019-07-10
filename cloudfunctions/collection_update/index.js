const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {

  const { id } = event
  console.log(event)

  try {
    return await db.collection('gushici').doc(id)
      .update({
        data: {
          opened: _.inc(1)
        },
      })
  } catch (e) {
    console.error(e)
  }
}