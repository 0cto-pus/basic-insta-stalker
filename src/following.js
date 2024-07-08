const axios = require('axios');
const fs = require('fs');
const path = require('path');

class FollowingManager {
  constructor() {
    this.id = '123';
    this.pretty = false;
    this.headers = {};
  }

  async getFollowing() {
    const followingPath = `./outputs/${this.id}-following.json`;
    const followingPathNew = `./outputs/${this.id}-following_new.json`;

    let allFollowings = [];
    let nextMaxId = null;
    let chunkCount = 0;

    do {
      const options = {
        method: 'GET',
        url: `https://www.instagram.com/api/v1/friendships/${this.id}/following/`,
        headers: this.headers,
        params: {
          max_id: nextMaxId,
        },
      };

      try {
        const response = await axios.request(options);
        console.log('Chunk ' + chunkCount++);
        const users = response.data.users;

        if (users.length === 0) {
          break;
        }

        allFollowings = [...allFollowings, ...users];
        nextMaxId = response.data.next_max_id;
      } catch (error) {
        console.error(error);
        break;
      }
    } while (nextMaxId);

    const ensureDirectoryExistence = (filePath) => {
      const dirname = path.dirname(filePath);
      if (fs.existsSync(dirname)) {
        return true;
      }
      fs.mkdirSync(dirname, { recursive: true });
    };

    const newFile = fs.existsSync(followingPath)
      ? followingPathNew
      : followingPath;

    // Ensure the directory exists before writing the file
    ensureDirectoryExistence(newFile);

    fs.writeFileSync(
      newFile,
      JSON.stringify(allFollowings, null, this.pretty ? 2 : null),
      'utf-8'
    );
    return allFollowings;
  }
}

module.exports = FollowingManager;
