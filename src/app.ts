import express, {Express} from "express";
import morgan from "morgan";
import rootRouters from "./routers/root.router"
import {errorHandler} from "./middlewares/error.handler";


export const createApp = ():Express => {
    const app = express();
    app.use(morgan("combined"))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/api/v1", rootRouters)
    app.use(errorHandler)
    return app;
}
