const app = getApp();

Page({
  data: {
    votes: [],
    showCreateModal: false,
    voteTitle: '',
    options: ['', ''],
    deadline: ''
  },

  onLoad() {
    this.loadVotes();
  },

  onShow() {
    this.loadVotes();
  },

  async loadVotes() {
    try {
      wx.showLoading({ title: '加载中...' });
      const result = await app.getVoteList();
      if (result.success) {
        const votes = result.data.map(vote => ({
          ...vote,
          deadlineText: this.formatDate(vote.deadline)
        }));
        this.setData({ votes: votes });
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

  preventBubble() {
    // 阻止事件冒泡
  },

  showCreateModal() {
    this.setData({ showCreateModal: true });
  },

  closeCreateModal() {
    this.setData({ showCreateModal: false, voteTitle: '', options: ['', ''], deadline: '' });
  },

  onTitleInput(e) {
    this.setData({ voteTitle: e.detail.value });
  },

  onOptionInput(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const options = [...this.data.options];
    options[index] = e.detail.value;
    this.setData({ options });
  },

  addOption() {
    if (this.data.options.length < 6) {
      this.setData({ options: [...this.data.options, ''] });
    } else {
      wx.showToast({ title: '最多6个选项', icon: 'none' });
    }
  },

  removeOption(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (this.data.options.length > 2) {
      const options = this.data.options.filter((_, i) => i !== index);
      this.setData({ options });
    }
  },

  onDeadlineChange(e) {
    this.setData({ deadline: e.detail.value });
  },

  async createVote() {
    if (!this.data.voteTitle.trim()) {
      wx.showToast({ title: '请输入投票标题', icon: 'none' });
      return;
    }
    
    const validOptions = this.data.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      wx.showToast({ title: '至少需要2个选项', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '创建中...' });
      const result = await app.createVote({
        title: this.data.voteTitle.trim(),
        options: validOptions,
        deadline: this.data.deadline ? `${this.data.deadline} 23:59:59` : null
      });

      if (result.success) {
        wx.showToast({ title: '创建成功', icon: 'success' });
        this.closeCreateModal();
        this.loadVotes();
      } else {
        wx.showToast({ title: result.errMsg || '创建失败', icon: 'none' });
      }
    } catch (e) {
      console.error(e);
      wx.showToast({ title: '创建失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  goToDetail(e) {
    const voteId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/vote/detail?id=${voteId}`
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '无截止时间';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
});