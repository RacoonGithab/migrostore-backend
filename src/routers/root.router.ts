import express from "express";
import userRouters from "./users.router"

const rootRouters = express.Router();

rootRouters.use("/users", userRouters)

export default rootRouters;