import express, {Express} from "express";
import morgan from "morgan";
import routers from "./routers/root.router  "


export const createApp = ():Express => {
    const app = express();
    app.use(morgan("combined"))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use("/api/v1", routers)
    return app;
}
