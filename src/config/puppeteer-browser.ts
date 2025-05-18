import puppeteer, { Browser } from 'puppeteer';

let puppeteerBrowser: Browser | null = null;

export const getBrowserInstance = async () => {
    if (!puppeteerBrowser) {
        puppeteerBrowser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
    }
    return puppeteerBrowser;
};

export const closeBrowser = async () => {
    if (puppeteerBrowser) {
        await puppeteerBrowser.close();
        puppeteerBrowser = null;
    }
};