import {Express} from "express";
import {createApp} from "./app";
import dotenv from 'dotenv';

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

console.log(process.env);

const app = createApp();
startServer(app, APP_PORT);