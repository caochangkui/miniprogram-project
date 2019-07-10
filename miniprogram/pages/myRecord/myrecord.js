const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    isDown: false,
    showMore: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type + ' - 记录'
    })

    wx.showLoading({
      title: '加载中...',
    })

    this.getHistoryList(options.type)

  },

  getHistoryList(type) {
    let openid = app.globalData.openid
    let database = ''
    let condition = {}
    let that = this

    if (type == '成语接龙') {
      database = 'idiom_jielong'
      condition = {
        _openid: openid
      }
    }

    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database,
        page: 1,
        num: 1,
        condition
      },
    }).then(res => {
      if (!res.result.data.length) {
        console.log('没找到')
      } else {
        let res_data = res.result.data[0]
        that.setData({
          historyList: res_data.historyList
        })
      }

      wx.hideLoading()
      that.setData({
        isDown: true
      })
    })
      .catch(console.error)
  },

  foldToggle(e) {
    this.setData({
      showMore: -1
    })
  },

  unfoldToggle(e) {
    this.setData({
      showMore: e.currentTarget.dataset.parentidx
    })
  },

  goJielong(e) {
    wx.redirectTo({
      url: `/pages/idiom-jielong/idiom-jielong`,
    })
  },

  goIdiomDetail (e) {
    let idiom = e.currentTarget.dataset.idiom
    if (idiom) {
      wx.navigateTo({
        url: `/pages/idiom-detail/idiom-detail?idiom=${idiom}`,
      })
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