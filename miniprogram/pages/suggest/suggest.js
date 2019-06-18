// miniprogram/pages/suggest/suggest.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    list: [],
    isDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'user_suggest',
        page: 1,
        num: 1,
        condition: {
          _id: 'user-suggest'
        }
      },
    }).then((res) => {
      console.log('建议列表：', res)
      this.setData({
        list: res.result.data[0].list
      })
    })
  },


  bindKeyInput (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  submitInput () {
    let {inputValue, list} = this.data
    this.setData({
      isDisabled: true
    })
    wx.showLoading({
      title: '提交中...',
    })

    let content = {
      openid: app.globalData.openid,
      avatarUrl: app.globalData.avatarUrl,
      username: app.globalData.username,
      suggests: inputValue,
      time: this.timestampToTime(Date.parse(new Date())),
    }

    list.unshift(content)

    wx.cloud.callFunction({
      name: 'feihua_history_update',
      data: {
        database: 'user_suggest',
        id: this.data._id,
        data: {
          list
        }
      },
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        mask: true,
        duration: 1500
      })
    })
      .catch(console.error)

  },

  timestampToTime(timestamp, isMs = true) {
    const date = new Date(timestamp * (isMs ? 1 : 1000))
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
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