import { connectRedis } from '../config/redis';
import initializeFirebase from "../config/firebase";

export async function initializeAppServices() {
    try {
        await connectRedis();
        console.log('✅ Redis initialized');
        initializeFirebase();
    } catch (error) {
        console.error('❌ Error initializing app services:', error);
        throw error;
    }
}