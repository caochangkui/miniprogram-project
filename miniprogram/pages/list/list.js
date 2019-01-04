// miniprogram/pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0, // 页码起始下标
    num: 10, // 每页展示个数
    searchContent: '', // 搜索内容或者搜索标签id
    searchIsTags: false, // 是否搜索的是标签id
    loading: false, // 是否正在加载
    isOver: false, // 滑动到底
    noList: false // 搜索结果为空
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.content //页面标题为路由参数
    })

    console.log(options)

    if (options.tags) {
      this.data.searchContent = options.tags
      this.data.searchIsTags = true
      this.loadList(options.tags, 'https://apis.juhe.cn/cook/index?cid')
    } else {
      this.data.searchContent = options.content
      this.loadList(options.content, 'https://apis.juhe.cn/cook/query.php?menu')
    }

  },

  goDetail (e) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },

  // 上拉加载
  lower() {
    console.log('lower');
    if (!this.data.loading) {
      if (this.data.searchIsTags) {
        this.loadList(this.data.searchContent, 'https://apis.juhe.cn/cook/index?cid')
      } else {
        this.loadList(this.data.searchContent, 'https://apis.juhe.cn/cook/query.php?menu')
      }

    }
  },

  // 加载列表
  loadList(content, url) {
    let that = this
    const db = wx.cloud.database()
    const _ = db.command
    if (!this.data.isOver) {
      let { list, index, num } = this.data;
      wx.showLoading({
        title: '正在加载...',
        mask: true
      });
      this.setData({
        loading: true
      });
      wx.request({
        url: `${url}=${content}&pn=${index}&rn=${num}&key=yourkey`,
        success: (res) => {
          console.log(res)
          if (!res.data.result) { // 没搜索到
            that.setData({
              loading: false,
              noList: true
            });
          } else {
            let res_data = res.data.result.data
            console.log(res_data)
            if (res_data.length) {
              list.push(...res_data)
              console.log(list)

              // 每次从api拿到数据后先查询数据库中是否存在,如果不存在则插入数据库
              res_data.map((val,index) => {
                db.collection('food').where({
                  id: _.eq(val.id)
                }).get({
                  success(res) {
                    console.log('查询结果:', res.data)
                    if (!res.data.length) { // 数据库中不存在此id的菜品
                      db.collection('food').add({
                        data: val
                      })
                    }
                  },
                  fail(res) {
                    console.log('查询失败')
                  }
                })
              })

              that.setData({
                list,
                index: index + 10,
                loading: false
              });
            } else { // 没有新的内容，已到底
              this.setData({
                loading: false,
                isOver: true
              })
            }
          }
          wx.hideLoading();
        }
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