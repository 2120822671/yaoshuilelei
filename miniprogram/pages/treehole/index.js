const app = getApp();

Page({
  data: {
    inputValue: '',
    messages: []
  },

  onLoad() {
    this.loadMessages();
  },

  onShow() {
    this.loadMessages();
  },

  async loadMessages() {
    try {
      wx.showLoading({ title: '加载中...' });
      const result = await app.getTreeholeMessages();
      if (result.success) {
        this.setData({ messages: result.data });
      } else {
        wx.showToast({ title: result.errMsg || '加载失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '加载失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async publishMessage() {
    const content = this.data.inputValue.trim();
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }
    
    try {
      wx.showLoading({ title: '发布中...' });
      const result = await app.addTreeholeMessage(content);
      if (result.success) {
        this.setData({ inputValue: '' });
        this.loadMessages();
        wx.showToast({ title: '发布成功', icon: 'success' });
      } else {
        wx.showToast({ title: result.errMsg || '发布失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '发布失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  async likeMessage(e) {
    const id = e.currentTarget.dataset.id;
    try {
      const result = await app.likeTreeholeMessage(id);
      if (result.success) {
        this.loadMessages();
      } else {
        wx.showToast({ title: result.errMsg || '操作失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '操作失败，请重试', icon: 'none' });
    }
  }
});