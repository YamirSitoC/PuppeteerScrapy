const puppeteer = require('puppeteer');

(async()=>{
    // const browser = await puppeteer.launch({headless: "false"});
    // const browser = await puppeteer.launch({headless: "new"});
    const browser = await puppeteer.launch({headless: "True"});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.es');
    await page.screenshot({path:'amazon1.jpg'});

    await page.type('#twotabsearchtextbox','Libros de Javascript');
    await page.screenshot({path:'amazon2.jpg'});

    await page.click('.nav-search-submit input');
    await page.waitForSelector('[data.component-type=s-search-result]');
    await page.waitFor(2000);
    await page.screenshot({path:'amazon3.jpg'});

    const enlaces = await page.evaluate(()=>{
        const elements = document.querySelectorAll('[data.component-type=s-search-result] h2 a');

        const links = [];
        for(let elements of elements){
            links.push(elements.href);
        }
        return links;
    });

    // console.log(enlaces.length);

    const books = [];
    for(let enlace of enlaces){
        await page.goto(enlace);
        // await page.waitFor(1000);
        await page.waitForSelector('#productTitle');

        const book = await page.evaluate(()=>{
            const tmp = {};
            tmp.title = document.querySelector('#productTitle').innerText;
            tmp.author = document.querySelector('.author a').innerText;
            return tmp;
        });
        books.push(book);
    }

    console.log(books);

    await browser.close();
})();
