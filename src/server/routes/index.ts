import { Hono } from "hono";

import helloRoute from "./hello";
import hello2Route from "./hello2";

const routes = new Hono();

routes.route("/hello", helloRoute);
routes.route("/hello2", hello2Route);

export default routes;
