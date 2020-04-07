const puppeteer = require('puppeteer');
const BASE_URL = "https://www.instagram.com/accounts/emailsignup/?hl=en";
const TAG_URL = (tag) => `https://www.instagram.com/explore/tags/${tag}/?hl=en`;

const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({
            headless :false
        });
        instagram.page = await instagram.browser.newPage();
       
    },
    
    login : async (username , password ) => {
        
        await instagram.page.goto(BASE_URL, { waitUntil: "networkidle2" });
        let logButton = await instagram.page.$x('//a[contains(text(), "Log in")]');
        
        //1 - click on the login url button 
        await logButton[0].click();
        
        //await instagram.page.waitFor(1000);
        //await instagram.page.waitForNavigation({ waitUntil: "networkidle2" } );
        await instagram.page.waitFor(1000);
        
        //2 - Witting a username and password
        await instagram.page.type('input[name="username"]', username, { delay : 50 });

        await instagram.page.type('input[name="password"]', password, { delay : 50 });
        
        let logInButton = await instagram.page.$x('//div[contains(text(), "Log In")]');
        await logInButton[0].click();
        
        await instagram.page.waitFor(10000);
        await instagram.page.waitFor('a > svg[aria-label="Activity Feed"]');
    },

    likeTagsProcess : async (tags = []) => {
        for(let tag of tags){
            // got to tag page 
            await instagram.page.goto(TAG_URL(tag), { waitUntil : 'networkidle2' });
            await instagram.page.waitFor(1000);
            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');
            for(let i =0; i< 3 ; i++){
                let post = posts[i];
                //click on the post to like
                await post.click();
                // wait for model to appear    
                await instagram.page.waitFor('body[style ="overflow: hidden;"]');
                
                await instagram.page.waitFor(1000);
                
                // checking if it is already liked
                 let isLikable = await instagram.page.$('svg[aria-label="Like"]');
               

                if(isLikable){
                    await instagram.page.click('svg[aria-label="Like"]');
                }

                await instagram.page.waitFor(3000);
                //close the model
                    let closeModalButton = await instagram.page.$x('svg[aria-label="Close"]');
                    await instagram.page.click('svg[aria-label="Close"]');

                    await instagram.page.waitFor(1000);
                }


                  
            }

                    await instagram.page.waitFor(6000);
                    debugger;
    }
}  

module.exports = instagram;
