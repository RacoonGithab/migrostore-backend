import express from "express";
import userRouters from "./users.router";
import authRouters from "./auth.router";

const rootRouters = express.Router();

rootRouters.use("/users", userRouters);

rootRouters.use("/auth", authRouters);

export default rootRouters;