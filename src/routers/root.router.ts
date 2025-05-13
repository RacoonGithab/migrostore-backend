import express from "express";
import userRouters from "./users.router";
import authRouters from "./auth.router";
import resumeRouter from "./resume.router";
import cityRouter from "./city.router";
import skillRouter from "./skill.router";

const rootRouters = express.Router();

rootRouters.use("/users", userRouters);

rootRouters.use("/auth", authRouters);

rootRouters.use("/resume", resumeRouter);

rootRouters.use("/city", cityRouter)

rootRouters.use("/skill", skillRouter)

export default rootRouters;