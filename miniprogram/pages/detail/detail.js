// miniprogram/pages/detail/detail.js
const app = getApp()

Page({

  data: {
    id: '',
    currentData: 0,
    detail: {},
    thisIndex: -1,
    page: 1,
    num: 1,
    logged: false,
    openid: '',
    isCollect: false,
    isDown: false,
    loading: false,
    isExist: true,
  },

  onLoad: function (options) {

    let isLogin = app.globalData.isLogin

    console.log('用户是否授权：', app.globalData.isLogin)
    console.log('是否已有用户openId：', app.globalData.openid)

    this.setData({
      id: options.id
    })

    this.setData({
      logged: isLogin ? true : false
    })

    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    if (options.id) {
      wx.setStorageSync('shareId', options.id)
      this.loadDetail(options.id)
    }

  },


  loadDetail(id) {
    let { detail, page, num } = this.data
    let that = this
    wx.showLoading({
      title: '详情加载中...',
    })

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'gushici',
        page,
        num,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.showToast({
          icon: 'warn',
          title: '加载失败',
        })
      } else {
        this.setData({
          detail: res.result.data[0]
        })

        wx.hideLoading()
      }
      that.setData({
        isDown: true
      })
    })
      .catch(err => {
        console.log('失败')
        that.setData({
          isExist: false
        })
      })
  },

  goList(e) {
    wx.navigateTo({
      url: `/pages/list/list?parenttags=${e.currentTarget.dataset.parenttags}&tags=${e.currentTarget.dataset.tags}`,
    })
  },

  goPoet(e) {
    let poet = e.currentTarget.dataset.poet
    if (poet == '佚名') {
      return false;
    } else {
      wx.navigateTo({
        url: `/pages/poet/poet?poet=${e.currentTarget.dataset.poet}`,
      })
    }
  },

  //点击切换 Tab
  checkCurrent(e) {
    if (this.data.currentData === e.target.dataset.current) {
      return false
    } else {
      this.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  onBackhome() {
    wx.switchTab({
      url: `/pages/index/index`,
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

})