import { Hono } from "hono";
import authRegister from "./register";

const authRoutes = new Hono();

authRoutes.route("/register", authRegister);

export default authRoutes;
