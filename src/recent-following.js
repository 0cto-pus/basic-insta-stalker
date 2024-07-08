const fs = require('fs');

class RecentFollowingManager {
    constructor(id) {
        this.id = id;
    }

    result(oldFollowings, newFollowings) {
        const recentFollowings = [];

        newFollowings.forEach((newProfile) => {
            if (!oldFollowings.some((oldProfile) => oldProfile.pk_id === newProfile.pk_id)) {
                recentFollowings.push(newProfile);
            }
        });

        fs.writeFileSync(`./outputs/${this.id}-recentFollowings.json`, JSON.stringify(recentFollowings, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
        });

        fs.unlink(`./outputs/${this.id}-following.json`, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        fs.rename(`./outputs/${this.id}-following_new.json`, `./outputs/${this.id}-following.json`, (err) => {
            if (err) {
                console.error('Error renaming file:', err);
            }
        });

        console.log('Recently Followed:', recentFollowings);
    }

    recentlyFollowed() {
        fs.readFile(`./outputs/${this.id}-following.json`, 'utf8', (err, data1) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }

            fs.readFile(`./outputs/${this.id}-following_new.json`, 'utf8', (err, data2) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return;
                }

                const oldFollowings = JSON.parse(data1);
                const newFollowings = JSON.parse(data2);

                this.result(oldFollowings, newFollowings);
            });
        });
    }
}

module.exports = RecentFollowingManager;