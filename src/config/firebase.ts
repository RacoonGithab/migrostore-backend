import * as admin from 'firebase-admin';
import {env} from "./secrets";

const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
            if (env.FIREBASE_PROJECT_ID && privateKey && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_STORAGE_BUCKET) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: env.FIREBASE_PROJECT_ID,
                        privateKey: privateKey,
                        clientEmail: env.FIREBASE_CLIENT_EMAIL,
                    }),
                    storageBucket: env.FIREBASE_STORAGE_BUCKET,
                });
                console.log("✅ Firebase загружен из переменных окружения");
            } else {
                console.error("❌ Не все переменные окружения Firebase настроены.");
            }
        }
    } catch (error) {
        console.error("❌ Ошибка инициализации Firebase:", error);
    }
};

export const getBucket = () => admin.storage().bucket();
export default initializeFirebase;
