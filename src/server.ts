import {Express} from "express";
import {createApp} from "./app";
import dotenv from 'dotenv';
import {connectRedis} from "./config/redis";
import initializeFirebase from "./config/firebase";

dotenv.config();

const APP_PORT = parseInt(process.env.APP_PORT!, 10)

const startServer = (app:Express, port: number):void => {
    app.listen(port, (err?:Error):void => {
        if (err) {
            console.error(`Start server error: ${err.message}`);
        } else {
            console.info(`Server running on port: ${port}`);
        }
    })
}

(async () => {
    try {
        await connectRedis();
        initializeFirebase()
        const app = createApp();
        startServer(app, APP_PORT);
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
})();