import * as admin from 'firebase-admin';
import {
    FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_STORAGE_BUCKET,
} from "./secrets";

const initializeFirebase = () => {
    try {
        if (!admin.apps.length) {
            const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
            if (FIREBASE_PROJECT_ID && privateKey && FIREBASE_CLIENT_EMAIL && FIREBASE_STORAGE_BUCKET) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: FIREBASE_PROJECT_ID,
                        privateKey: privateKey,
                        clientEmail: FIREBASE_CLIENT_EMAIL,
                    }),
                    storageBucket: FIREBASE_STORAGE_BUCKET,
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
