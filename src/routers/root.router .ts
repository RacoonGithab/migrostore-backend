import express from "express";
import userRouters from "./users.router"

const routers = express.Router();

routers.use("/users", userRouters)

export default routers;