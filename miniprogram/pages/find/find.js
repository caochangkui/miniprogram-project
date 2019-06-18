// pages/find/find.js
const app = getApp()

Page({
  data: {
    logged: false,
    avatarUrl: '',
    username: '',
  },

  onLoad: function (options) {
    let isLogin = app.globalData.isLogin
    this.setData({
      logged: isLogin ? true : false
    })
  },

  goJielong(e) {
    if (this.data.logged) {
      wx.navigateTo({
        url: `/pages/idiom-jielong/idiom-jielong`,
      })
    } else {
      this.onGetUserInfo(e)
      wx.navigateTo({
        url: `/pages/idiom-jielong/idiom-jielong`,
      })
    }
  },

  goRecord(e) {
    if (this.data.logged) {
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
        url: `/pages/myRecord/myrecord?type=${type}`,
      })
    } else {
      this.onGetUserInfo(e)
    }
  },

  goRanking(e) {
    let type = e.currentTarget.dataset.type
    if (this.data.logged) {
      wx.navigateTo({
        url: `/pages/ranking/ranking?type=${type}`,
      })
    } else {
      this.onGetUserInfo(e)
      wx.navigateTo({
        url: `/pages/ranking/ranking?type=${type}`,
      })
    }
  },

  goFeihuaSelect(e) {
    wx.navigateTo({
      url: `/pages/feihua-select/feihua-select`,
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

  gocangtoushi() {
    wx.navigateTo({
      url: `/pages/cangtoushi/cangtoushi`,
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
    console.log('是否已有用户openId：', app.globalData)
    let isLogin = app.globalData.isLogin
    this.setData({
      logged: isLogin ? true : false
    })
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