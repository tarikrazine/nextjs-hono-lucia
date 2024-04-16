import { Hono } from "hono";

const hello2Route = new Hono();

hello2Route.get("/", (c) => c.json({ timenow: new Date().getTime() }));

export default hello2Route;
