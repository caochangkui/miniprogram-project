//app.js

App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
      }
    })


    /**
     * 进入小程序，先判断用户是否已授权,
     * 如果已授权，获取用户信息，并存入全局变量globalData和缓存Storage
     * 如果未授权或用户取消授权，则删除全局变量globalData和缓存Storage中的用户信息
     */
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('isLogin', 'isLogin')
              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
              wx.setStorageSync('username', res.userInfo.nickName)
              this.globalData.isLogin = wx.getStorageSync('isLogin')
              this.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
              this.globalData.username = wx.getStorageSync('username')
            }
          })
        } else {
          console.log('未授权')
          wx.removeStorageSync('isLogin')
          wx.removeStorageSync('avatarUrl')
          wx.removeStorageSync('username')
          this.globalData.isLogin = ''
          this.globalData.avatarUrl = ''
          this.globalData.username = ''
        }
      }
    })
  }

})
