Page({

  /**
   * 页面的初始数据
   */
  data: {
    alphabeta: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    thisLetter: '',
    list: [],
    sentence: {},
    sentencePage: 50,
    page: 1,
    num: 10,
    loading: false,
    isOver: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList('')
  },

  lower(e) {
    if (!this.data.loading) {
      this.getList(this.data.thisLetter)
    }
  },

  getLetterList (e) {
    let letter = e.currentTarget.dataset.letter
    this.setData({
      isOver: false,
      list: [],
      page: 1,
      thisLetter: letter
    })
    this.getList(letter)
  },

  getList(letter) {
    if (!this.data.isOver) {
      let { list, page, num } = this.data
      let that = this
      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: 'collection_get',
        data: {
          database: 'idiom2',
          page,
          num,
          condition: {abbreviation: {
            $regex:'^'+ letter,
            $options: 'i'
          }}
        },
      }).then(res => {
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
      url: `/pages/idiom-detail/idiom-detail?id=${_id}`,
    })
  },

  goSearch (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/search/search?type=${type}`,
    })
  },

  goJielong(e) {
    wx.switchTab({
      url: `/pages/find/find`,
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