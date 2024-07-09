## Basic Cookie-Based Stalker.

 - When run, it creates a 'following' file inside outputs folder.
   Subsequent runs will also create a 'following' file and compare it
   with the old file, displaying new followers in a new file as 'recent
   following'. 
   
 - You can download all files from that specific id you provide. (Videos 
   and carousel photos are not inclueded.)

## How to Use

 - Add headers and stalk id into the .env file.
 - Call getRecentFollowings(); method inside the index.js.
 - To download, call downloadAllPosts(); method.
 - Run the file again when you stalk another time. It will create
   recentFollowings.JSON file.
 - You can check that JSON file and see the recent followings.
