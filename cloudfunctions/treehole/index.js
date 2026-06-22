const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { OPENID } = wxContext;
  const { action, data } = event;

  try {
    switch (action) {
      case 'list':
        return await getMessages();
      case 'add':
        return await addMessage(data.content, OPENID);
      case 'like':
        return await likeMessage(data.messageId, OPENID);
      case 'delete':
        return await deleteMessage(data.messageId, OPENID);
      default:
        return { success: false, errMsg: '未知操作' };
    }
  } catch (err) {
    console.error('树洞操作失败:', err);
    return { success: false, errMsg: err.message };
  }
};

async function getMessages() {
  const result = await db.collection('treehole')
    .orderBy('createdAt', 'desc')
    .get();

  return { success: true, data: result.data };
}

async function addMessage(content, openid) {
  if (!content || content.trim().length === 0) {
    return { success: false, errMsg: '内容不能为空' };
  }

  const userResult = await db.collection('users').where({ openid }).get();
  const nickName = userResult.data.length > 0 ? userResult.data[0].nickName : '匿名用户';

  const result = await db.collection('treehole').add({
    data: {
      content: content.trim(),
      createdAt: db.serverDate(),
      createdBy: openid,
      nickName,
      likes: 0,
      likedBy: []
    }
  });

  return { success: true, data: result };
}

async function likeMessage(messageId, openid) {
  const result = await db.collection('treehole').doc(messageId).get();
  const message = result.data;

  if (message.likedBy.includes(openid)) {
    const newLikedBy = message.likedBy.filter(id => id !== openid);
    await db.collection('treehole').doc(messageId).update({
      data: {
        likes: message.likes - 1,
        likedBy: newLikedBy
      }
    });
    return { success: true, data: { liked: false, likes: message.likes - 1 } };
  } else {
    await db.collection('treehole').doc(messageId).update({
      data: {
        likes: message.likes + 1,
        likedBy: [...message.likedBy, openid]
      }
    });
    return { success: true, data: { liked: true, likes: message.likes + 1 } };
  }
}

async function deleteMessage(messageId, openid) {
  const result = await db.collection('treehole').doc(messageId).get();
  const message = result.data;

  if (message.createdBy !== openid) {
    return { success: false, errMsg: '没有权限删除' };
  }

  await db.collection('treehole').doc(messageId).remove();
  return { success: true };
}