import express from "express";
import userRouters from "./users.router";
import authRouters from "./auth.router";
import resumeRouter from "./resume.router";
import cityRouter from "./city.router";
import skillRouter from "./skill.router";
import resetPasswordRouters from "./reset-password.router";
import userProfileRouter from "./user-profile.router";
import countryRouter from "./country.router";

const rootRouters = express.Router();

rootRouters.use("/users", userRouters);

rootRouters.use("/auth", authRouters);

rootRouters.use("/user-profile", userProfileRouter);

rootRouters.use("/password-reset", resetPasswordRouters)

rootRouters.use("/resume", resumeRouter);

rootRouters.use("/country", countryRouter)

rootRouters.use("/city", cityRouter)

rootRouters.use("/skill", skillRouter)

export default rootRouters;