// miniprogram/pages/cangtoushi/cangtoushi.js
const app = getApp()

const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    num: 1,
    loading: false,
    isOver: false,
    key: false,
    dynasty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let { key, dynasty } = e.detail.value

    if (!key) {
      return
    }

    if (key.trim().length > 6) {
      wx.showToast({
        title: '错误',
        image: '/images/warn.png',
        title: `姓名字数太多`,
        duration: 1500
      })
      return
    }

    this.setData({
      list: [],
      key: key.trim(),
      dynasty,
      loading: true,
      isOver: false,
    })

    this.getNameFrom(this.data.key, this.data.dynasty)

    this.saveCangtoushiHistory(this.data.key)

  },

  saveCangtoushiHistory (key) {
    const db = wx.cloud.database()
    db.collection('cangtoushi').doc('cangtoushi-history').get({
      success: res => {
        console.log(res)
        let list = res.data.list
        let openid = app.globalData.openid
        let username = app.globalData.username || '未授权用户'

        list.push({
          openid,
          username,
          key
        })

        wx.cloud.callFunction({
          name: 'collection__jielong_update',
          data: {
            database: 'cangtoushi',
            id: 'cangtoushi-history',
            data: {
              list
            }
          },
        }).then(res => {
          console.log('更新藏头诗关键词列表：', res)
        })
          .catch(console.error)
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  reload () {
    this.setData({
      page: this.data.page + 1,
      list: [],
      loading: true,
      isOver: false,
    })

    this.getNameFrom(this.data.key, this.data.dynasty)
  },

  async getNameFrom (key, dynasty) {
    let arr = key.split('')
    let tasks = []

    for(let i = 0; i<arr.length; i++) {
      tasks.push(this.asyncGetNameFrom(arr[i], dynasty))
    }

    let resArr = await Promise.all(tasks)
    let flag = true

    resArr.map((val,index) => {
      if (!val.poem) {
        flag = false
      }
    })

    this.setData({
      list: flag ? resArr : [],
      loading: false,
      isOver: flag ? false : true
    })
  },

  asyncGetNameFrom (word, dynasty) {
    if (!this.data.isOver) {
      let { page, num } = this.data
      let that = this
      let condition = {
        content: {
          $regex: '.*' + word,
          $options: 'i'
        },
        dynasty: dynasty
      }

      return new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'collection_get',
          data: {
            database: 'feihualing',
            page,
            num,
            condition
          },
        }).then((res) => {
          let one = {}
          if (res.result.data.length) {
            one = {
              word,
              poem: this.splitPoem(res.result.data[0],word)
            }
          }
          resolve(one)
        }).catch((err) => {
          reject(err)
        })
      })
    }
  },

  splitPoem (poem, word) {
    let _poem = {}
    Object.assign(_poem,poem);
    let arr = poem.content.split('。')
    let _arr = arr.filter(val => val.indexOf(word) != -1)
    _poem.content = _arr[0] + '。'
    return _poem
  },

  goCangtoushiDetail (e) {
    let _id = e.currentTarget.dataset.id
    console.log(_id)
    wx.navigateTo({
      url: `/pages/cangtoushi-detail/cangtoushi-detail?id=${_id}`,
    })
  },


  onBackhome() {
    wx.switchTab({
      url: `/pages/index/index`,
    })
  },


  onShareAppMessage(res) {
    return {
      title: '我的姓名竟然出现在一首古诗词里，快来查查你的吧',
      path: `pages/cangtoushi/cangtoushi`
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

})