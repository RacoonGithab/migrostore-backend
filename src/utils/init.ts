import { connectRedis } from '../config/redis';
import initializeFirebase from "../config/firebase";
import {closeBrowser} from "../config/puppeteer-browser";

export async function initializeAppServices() {
    try {
        await connectRedis();
        console.log('✅ Redis initialized');
        initializeFirebase();

        process.on('SIGINT', async () => {
            console.log('Closing browser and other services...');
            try {
                await closeBrowser();
            } catch (error) {
                console.error('Error closing browser:', error);
            }
            process.exit();
        });

        process.on('SIGTERM', async () => {
            console.log('Closing browser and other services...');
            try {
                await closeBrowser();
            } catch (error) {
                console.error('Error closing browser:', error);
            }
            process.exit();
        });
    } catch (error) {
        console.error('❌ Error initializing app services:', error);
        throw error;
    }
}