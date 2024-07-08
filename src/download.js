const axios = require('axios');
const fs = require('fs');
require("dotenv").config({ path: "../.env" });
const path = require('path');

class DownloadManager {
    constructor() {
        this.id = '123';
        this.pretty = false;
        this.headers = {};
    }

    async downloadPosts(posts, folderPath) {
        try {

            for (const item of posts) {
                if (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates.length > 0) {
                    const imageUrl = item.image_versions2.candidates[0].url;
                    console.log(imageUrl);
                    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1).split('.')[0];
                    const filePath = path.join(folderPath, `${filename}.jpg`);
                    fs.writeFileSync(filePath, Buffer.from(response.data));
                    console.log(`Image downloaded and saved: ${filename}`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getPosts() {
        let allPosts = [];
        let nextMaxId = null;
        let chunkCount = 0;

        const postsPath = `./outputs/${this.id}-${Date.now()}-posts.json`;
        const folderPath = path.join(__dirname, `${this.id}_downloaded_images`);
        fs.mkdirSync(folderPath);
        do {
            const options = {
                method: 'GET',
                url: `https://www.instagram.com/api/v1/feed/user/${this.id}`,
                headers: this.headers,
                params: {
                    max_id: nextMaxId
                },
            };

            try {
                const response = await axios.request(options);
                console.log("Chunk " + chunkCount++);
                const posts = response.data.items;
                if (posts.length === 0) {
                    break;
                }

                allPosts = [...allPosts, ...posts];
                await this.downloadPosts(posts, folderPath);
                nextMaxId = response.data.next_max_id;

            } catch (error) {
                console.error(error);
                break;
            }
        } while (nextMaxId);
        fs.writeFileSync(postsPath, JSON.stringify(allPosts, null, this.pretty ? 2 : null), 'utf-8');
        console.log("Completed.");
    }
}


module.exports = DownloadManager;