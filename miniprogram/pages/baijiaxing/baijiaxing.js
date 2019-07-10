Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    sentence: {},
    sentencePage: 50,  页码
    page: 1,
    num: 10,
    loading: false,
    isOver: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },


  lower(e) {
    console.log('上拉加载')
    if (!this.data.loading) {
      this.getList()
    }
  },

  getList() {
    if (!this.data.isOver) {
      let { list, page, num } = this.data
      let that = this
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'baijiaxing',
          page,
          num,
          condition: {}
        },
      }).then(res => {
        console.log(res.result)
        if (!res.result.data.length) {
          that.setData({
            loading: false,
            isOver: true
          })
        } else {
          let res_data = res.result.data
          list.push(...res_data)
          that.setData({
            list,
            page: page + 1,
            loading: false
          })
        }
      })
        .catch(console.error)
    }
  },

  goDetail (e) {
    let _id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/baijiaxing-detail/baijiaxing-detail?id=${_id}`,
    })
  },

  goSearch (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/search/search?type=${type}`,
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