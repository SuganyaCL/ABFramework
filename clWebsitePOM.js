class CLWebsite {
    categorySelection(category) { return $(`//p[text()="${category}"]`) };
    // get ringCategory() { return $('//p[text()="Rings"]') };
    // get earringsCategory() { return $('//p[text()="Earrings"]') };
    get product() { return $$('//div[@itemtype="https://schema.org/ItemList"]//div[@span="1"]') };
    get seeProductDetails() { return $('(//a[text()="See Product Details"])[1]') };


    async randomCategory(categoryArray) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const randomNum = Math.floor(Math.random() * categoryArray.length);
                resolve(categoryArray[randomNum]);
            }, 1000);
        });
    };
    
}
module.exports = new CLWebsite();