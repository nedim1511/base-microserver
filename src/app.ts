import express = require("express");
import bodyParser from "body-parser";
import container from "./injection-container";
import { scopePerRequest } from "awilix-express";
import DatabaseConnector from "./database-connector";
import logger from "./logger";
import helmet from "helmet";
import contextService from "request-context";
import { Context } from "./context";
import { TestController } from "./controllers/test-controller";
import { ReadyComponentController } from "./controllers/ready-component-controller";
import { StyleController } from "./controllers/style-constroller";
import {ReportDefinitionController} from "./controllers/report-definition-controller";

const fileController = require('./controllers/file-controller.ts');

const app: express.Application = express();
const upload = require("./services/image-upload-service");

app.use(helmet());

new DatabaseConnector().connect();

app.use(contextService.middleware("request"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  if (!req.originalUrl || req.originalUrl === "/" || req.originalUrl === "") {
    return;
  } else {
    logger.info("Rest call started");
    logger.info(`Type: ${req.method}, URL: ${req.originalUrl}`);
    logger.info(`Req body: ${JSON.stringify(req.body)}`);
    next();
  }
});

app.use((req, res, next) => {
  contextService.set("request:context", new Context(new Date()));
  next();
});

app.use(scopePerRequest(container));

app.use("/api/test", new TestController().router);
app.use("/api/ready-components", new ReadyComponentController().router);
app.use("/api/report-definitions", new ReportDefinitionController().router);
app.use("/api/styles", new StyleController().router);
app.use("/api/file", fileController);

app.post("/api/image-upload", upload.any(), (req, res) => {
  res.send({ image: req.file });
});

app.use((req, res, next) => {
  if (!req.route) return next(new Error("Url was not matched any route"));
  next();
});

app.use((req, res, next) => {
  if (res.locals.answer !== undefined && res.locals.answer !== null) {
    logger.info(`rest call end. (no error)`);
    if (res.locals.answer !== "DOWNLOAD") {
      res.status(201).json(res.locals.answer);
    }
  } else {
    next(new Error("answer was not found in res.locals"));
  }
});
app.use((error: any, req: any, res: any, next: any) => {
  logger.error(`rest call end time: (error) ${new Date()}`);
  logger.error("Unexpected error:");
  logger.error(error);
  res.status(500).json({ message: error.message });
});

export default app;
