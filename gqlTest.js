const td = require('../data/clDatas');
const clWeb = require('../pageobjects/clWebsitePOM');
let interceptedRequests;

describe('GQL Request Assertion', async () => {

    before(async () => {
        await browser.url(td.urls.r2Stage);
        await browser.maximizeWindow();
    });

    it('[TC_01] Verify the Caratlane Homepage', async () => {
        await expect(browser).toHaveTitle(td.datas.homePageTitle);
        await expect(browser).toHaveUrl(td.urls.r2Stage);
    });

    it('[TC_02] Go to any Product Detail Page', async () => {
        const category = await clWeb.randomCategory(td.datas.categories);
        await clWeb.categorySelection(category).waitForClickable();
        await clWeb.categorySelection(category).click();
        (await clWeb.product[0]).waitForDisplayed({ timeout: 10000, timeoutMsg: "Product is not displayed yet" });
        await browser.emulateDevice('iPhone X');
        await browser.setupInterceptor();
        await clWeb.product[5].scrollIntoView();
        await clWeb.product[5].click();
    });

    it('[TC_03] Verify the GQL Request', async () => {
        // Waiting till the page has a request body containing "getPageVariantInfoQuery"
        await browser.waitUntil(async () => {
            interceptedRequests = await browser.getRequests();
            return interceptedRequests.some(request =>
                request.body && request.body.query && request.body.query.includes("getPageVariantInfoQuery")
            );
        }, { timeout: 10000, timeoutMsg: "GQL request not found within timeout" });
        // A For of loop to iterate all the request captured by getRequest() function 
        for (const request of interceptedRequests) {
            if (request.body && request.body.query && request.body.query.includes("getPageVariantInfoQuery")) {
                const response = await request.response.body;
                const responseBody = await JSON.stringify(response, null, 2);
                // Printing and Assertion
                console.log('URL: ', request.url + '\n');
                await expect(request.response.statusCode).toEqual(200);
                await expect(request.url).toEqual(td.requestURL.stageGQLURL);
                console.log("Request Body: ", request.body);
                console.log('Method Type: ', request.method + '\n');
                await expect(request.method).toEqual('POST');
                console.log('Response Body: ', responseBody);
            };
        };

    });

})