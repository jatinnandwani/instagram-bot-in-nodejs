const ig = require("./instagram");

(async () => {
    await ig.initialize();
    await ig.login('YOURUSERNAME','YOUPASSWORD');
    await ig.likeTagsProcess(['cars','bikes','scooter']);
    debugger;
})()