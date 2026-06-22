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
      case 'get':
        return await getUserInfo(OPENID);
      case 'update':
        return await updateUserInfo(OPENID, data);
      case 'getCollections':
        return await getUserCollections(OPENID);
      case 'addCollection':
        return await addCollection(OPENID, data);
      case 'removeCollection':
        return await removeCollection(OPENID, data.storyId);
      case 'getUploads':
        return await getUserUploads(OPENID);
      case 'addUpload':
        return await addUpload(OPENID, data);
      case 'deleteUpload':
        return await deleteUpload(OPENID, data.fileId);
      default:
        return { success: false, errMsg: '未知操作' };
    }
  } catch (err) {
    console.error('用户操作失败:', err);
    return { success: false, errMsg: err.message };
  }
};

async function getUserInfo(openid) {
  const result = await db.collection('users').where({ openid }).get();
  
  if (result.data.length === 0) {
    return { success: false, errMsg: '用户不存在' };
  }

  return { success: true, data: result.data[0] };
}

async function updateUserInfo(openid, data) {
  const updateData = {};
  if (data.nickName) updateData.nickName = data.nickName;
  if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
  
  await db.collection('users').where({ openid }).update({
    data: updateData
  });

  return { success: true };
}

async function getUserCollections(openid) {
  const result = await db.collection('story_collections')
    .where({ createdBy: openid })
    .orderBy('createdAt', 'desc')
    .get();

  return { success: true, data: result.data };
}

async function addCollection(openid, data) {
  const existing = await db.collection('story_collections')
    .where({ createdBy: openid, storyId: data.storyId })
    .get();

  if (existing.data.length > 0) {
    return { success: false, errMsg: '已收藏' };
  }

  await db.collection('story_collections').add({
    data: {
      storyId: data.storyId,
      storyData: data.storyData,
      createdBy: openid,
      createdAt: db.serverDate()
    }
  });

  return { success: true };
}

async function removeCollection(openid, storyId) {
  const result = await db.collection('story_collections')
    .where({ createdBy: openid, storyId })
    .get();

  if (result.data.length === 0) {
    return { success: false, errMsg: '未找到收藏' };
  }

  await db.collection('story_collections')
    .where({ createdBy: openid, storyId })
    .remove();

  return { success: true };
}

async function getUserUploads(openid) {
  const result = await db.collection('user_uploads')
    .where({ createdBy: openid })
    .orderBy('createdAt', 'desc')
    .get();

  return { success: true, data: result.data };
}

async function addUpload(openid, data) {
  await db.collection('user_uploads').add({
    data: {
      fileID: data.fileID,
      cloudPath: data.cloudPath,
      createdBy: openid,
      createdAt: db.serverDate()
    }
  });

  return { success: true };
}

async function deleteUpload(openid, fileId) {
  const result = await db.collection('user_uploads')
    .where({ createdBy: openid, fileID: fileId })
    .get();

  if (result.data.length === 0) {
    return { success: false, errMsg: '未找到文件' };
  }

  await cloud.deleteFile({
    fileList: [fileId]
  });

  await db.collection('user_uploads')
    .where({ createdBy: openid, fileID: fileId })
    .remove();

  return { success: true };
}