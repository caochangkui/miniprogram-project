// miniprogram/pages/user/user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    userInfo: {},
    avatarUrl: '',
    openid: '',
    logged: false,
    username: '',
    place: '',
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('进入用户页检查是否登录:', this.data.logged)
    console.log('是否已授权：', wx.getStorageSync('isLogin'))
    console.log('是否已有用户openId：', app.globalData.openid)

    wx.showLoading({
      title: '正在加载...',
      mask: true
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => { 
              this.setData({
                logged: true,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                username: res.userInfo.nickName,
                place: res.userInfo.province + ', ' + res.userInfo.country
              })
            }
          })
        }
        wx.hideLoading();
      }
    })

    // 是否存在用户的openId
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

  },

  goDetail(e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) { 
      
      console.log(e)
      wx.setStorageSync('isLogin', 'isLogin')

      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        username: e.detail.userInfo.nickName,
        place: e.detail.userInfo.province + ', ' + e.detail.userInfo.country
      })

    }
  },

  // 读取收藏列表
  getcollect () {
    const db = wx.cloud.database()
    // 查看是否有收藏记录
    db.collection('food').where({
      _openid: this.data.openid,
      _id: 'collect' + this.data.openid
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res) 

        if (!res.data.length) { // 如果从未收藏
          console.log(' 从未收藏') 
          this.setData({
            collectList: []
          })
        } else { // 如果已有收藏记录
          db.collection('food').doc('collect' + this.data.openid).get().then(res => {
            console.log(res.data)
            this.setData({
              collectList: res.data.collectList
            })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcollect()
    console.log(0)
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