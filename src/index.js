const fs = require('fs');
require('dotenv').config();
const FollowingManager = require('./following.js');
const RecentFollowingManager = require('./recent-following.js');
const DownloadManager = require('./download.js');

const id = process.env.STALK_ID1; //STALK ID
const followingPath = `./outputs/${id}-following.json`;

const headers = {
  Cookie: process.env.COOKIE,
  'User-Agent': process.env.USER_AGENT,
  'X-Ig-App-Id': process.env.IG_APP_ID,
};

async function getRecentFollowings() {
  const followingManager = new FollowingManager();
  followingManager.id = id;
  followingManager.pretty = false;
  followingManager.headers = headers;

  if (!fs.existsSync(followingPath)) {
    await followingManager.getFollowing();
  } else {
    await followingManager.getFollowing();
    const recentFollowingManager = new RecentFollowingManager(id);
    recentFollowingManager.recentlyFollowed();
  }

  console.log('End');
}

async function downloadAllPosts() {
  const downloadManager = new DownloadManager();
  downloadManager.id = id;
  downloadManager.pretty = false;
  downloadManager.headers = headers;

  await downloadManager.getPosts();
}

//getRecentFollowings();
//downloadAllPosts();
