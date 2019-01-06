// miniprogram/pages/search/search.js
const app = getApp() 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    openid: '',
    showHistory: true,
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log('是否已有用户openId：', app.globalData.openid)

    // 是否存在用户的openId
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log(this.data.inputValue)
  },

  // 进入搜索结果页 -> list
  goSearch() {
    let content = this.data.inputValue
    if (!content) {
      console.log('内容为空')
      return
    }

    this.onHistory(content)

    wx.navigateTo({
      url: `/pages/list/list?content=${content}`,
    })
  },

  historyGoSearch(e) {
    console.log(e)
    let content = e.currentTarget.dataset.title
    wx.navigateTo({
      url: `/pages/list/list?content=${content}`,
    })
  },

  // 清空历史记录
  bindClearHistory() {
    const db = wx.cloud.database()
    db.collection('food').doc('history' + this.data.openid).update({
      data: {
        historyList: []
      }
    }).then((res) => {
      console.log(res)
      wx.showToast({
        icon: '删除',
        title: '清空历史',
      })
    })

    this.setData({
      historyList: []
    })
  },

  // 添加历史记录
  onHistory (content) {
    const db = wx.cloud.database()
    let that = this

    // 查看是否有历史记录
    db.collection('food').where({
      _openid: this.data.openid,
      _id: 'history' + this.data.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        if (!res.data.length) {
          console.log(' 历史记录为空')
          let historyArray = []
          historyArray.unshift(content)
          db.collection('food').add({
            data: {
              _id: 'history' + that.data.openid,
              description: 'history',
              historyList: historyArray
            }
          }).then(res => {
            console.log(res)
          })
        } else {    
          console.log('已有历史记录')
          let historyArray = res.data[0].historyList
          historyArray.unshift(content)
          console.log([...new Set(historyArray)])
          db.collection('food').doc('history' + that.data.openid).update({
            data: {
              historyList: [...new Set(historyArray)]
            }
          }).then((res) => {
            console.log(res)
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  // 读取历史记录
  getHistory() {
    let that = this
    const db = wx.cloud.database()
    db.collection('food').doc('history' + that.data.openid).get({
      success(res) {
        console.log(res.data)
        that.setData({
          historyList: res.data.historyList
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getHistory()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.getHistory()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})