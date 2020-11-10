// pages/index/index.js
// import { log } from 'console'
// import { log } from 'console'
import request from '../../utils/request'
import tools from '../../utils/tools'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图的数据
    recommendHeader: '',
    recommendList: [], // 推荐歌单的数据
    playListNameList: '', // 热门歌单名字
    navIconList: [], // 图标列表
  },

  test(e) {
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前设备信息
    wx.getSystemInfo({
      success: async (result) => {
        // 截取当前设备类型
        const systemType = result.system.slice(0, result.system.indexOf(' '))
        // 判断当前设备 is IOS or Android
        let isSystem = systemType === 'iOS' ? 2 : (systemType === 'Android' ? 1 : (systemType === 'Windows' ? 0 : 3))
        // 判断设备是否是平板
        if (result.windowWidth > 750) {
          isSystem = 3
        }
        // 首页-图标列表
        const {
          data: navIconListData
        } = await request('/homepage/dragon/ball')
        navIconListData.splice(1, 0, {
          id: -10,
          name: '私人FM',
          className: 'iconfont icon-FM'
        })
        navIconListData.push({
          id: -11,
          name: '唱聊',
          className: 'iconfont icon-changge'
        }, {
          id: -12,
          name: '游戏专区',
          className: 'iconfont icon-icon'
        })
        this.setData({
          navIconList: navIconListData
        })
        console.log(navIconListData);

        // 获取轮播图页面数据
        let bannerListData = await request('/banner', {
          type: isSystem
        })
        this.setData({
          bannerList: bannerListData.banners
        })

        // 获取推荐歌单的数据
        let recommendHeaderList = ['你的歌单精选站', '发现好歌单', '懂你的精选歌单', '人气歌单推荐']
        let recommendListData = await request('/personalized', {
          limit: 10
        })
        this.setData({
          recommendHeader: recommendHeaderList[Math.floor(Math.random() * recommendHeaderList.length)],
          recommendList: recommendListData.result,
        })

        // 获取排行榜的歌单数据
        let topListData = await request('/toplist')
        const a = tools.getRandomArrayElements(topListData.list, 5)
        let newTopList = []
        for (let i = 0, len = a.length; i < len; i++) {
          console.log(a[i].id);
          const {
            playlist: newTop
          } = await request('/playlist/detail', {
            id: a[i].id
          })
          newTop.tracks.splice(3, newTop.tracks.length - 3)
          console.log(newTop.tracks.length);
          newTopList.push(newTop)
        }
        console.log(newTopList);
        // topListData.list.sort(function (a, b) {
        //   return b.playCount - a.playCount
        // })
        // console.log(topListData);
        this.setData({
          playListNameList: newTopList
        })

      },
      fail: (err) => {
        console.log(err);
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