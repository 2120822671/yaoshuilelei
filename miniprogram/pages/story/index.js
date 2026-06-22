const app = getApp();

Page({
  data: {
    storyList: []
  },

  onLoad() {
    this.setData({
      storyList: app.globalData.storyList
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/story/detail?id=${id}`
    });
  }
});