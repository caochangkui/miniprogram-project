// miniprogram/pages/feihua-select/feihua-select.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logged: false,
    avatarUrl: '',
    username: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isLogin = app.globalData.isLogin
    this.setData({
      logged: isLogin ? true : false
    })
  },

  goFeihua (e) {
    wx.navigateTo({
      url: `/pages/feihualing/feihualing?type=${e.currentTarget.dataset.id}`,
    })
  },

  onGetUserInfo(e) {
    wx.getUserInfo({
      success: (res) => {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          username: e.detail.userInfo.nickName,
        })

        wx.setStorageSync('isLogin', 'isLogin')
        wx.setStorageSync('avatarUrl', this.data.avatarUrl)
        wx.setStorageSync('username', this.data.username)
        app.globalData.isLogin = wx.getStorageSync('isLogin')
        app.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
        app.globalData.username = wx.getStorageSync('username')
      },
      fail: res => {
        console.log(res)
      }
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})