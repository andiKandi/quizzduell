// tslint:disable-next-line: no-var-requires
require("dotenv-safe").config();
import "reflect-metadata";
import * as bodyParser from "body-parser";
import express from "express";
import { authMiddleware } from "./middleware/authentication";
import { globalRouter, initGlobalRoutes } from "./router/global.router";
import { createDatabaseConnection } from "./util/createDatabaseConnection";
import { WebSocketManager } from "./webSockets";
import http from "http";

const app = express();
const server = http.createServer(app);

const ws = new WebSocketManager(server);
const port: number = Number(process.env.PORT);

export const startServer = async () => {
  try {
    const dbConnection = await createDatabaseConnection();

    app.use(bodyParser.json());
    app.use(authMiddleware);

    app.use("/api", globalRouter);

    ws.initSocket();
    server.listen(port, () => {
      console.log("listening on *:4000");
    });

    initGlobalRoutes();
    return { server, dbConnection };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// tslint:disable-next-line: no-floating-promises
startServer();
