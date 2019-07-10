// miniprogram/pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isDown: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type + '排行榜'
    })

    wx.showLoading({
      title: '加载中...',
    })
    this.getRankingList(options.type)
  },

  getRankingList(type) {
    let database = ''
    let condition = {}
    let that = this

    if (type == '成语接龙') {
      database = 'idiom_jielong'
      condition = {
        _id: 'ranking-list'
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
        console.log('没找到jielong排行榜')
      } else {
        let res_data = res.result.data[0]

        let _list = res_data.rankingList
        _list.sort((a,b) => {
          return b.score - a.score
        })
        that.setData({
          list: _list.slice(0, 50)
        })
        wx.hideLoading()
      }

      that.setData({
        isDown: true
      })
    })
      .catch(console.error)
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