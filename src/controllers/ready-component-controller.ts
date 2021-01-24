import * as express from "express";
import responseHandler = require("../middleware/response-handle");
import ReadyComponentService from "../services/ready-component-service";
import ReadyComponent from "../models/ready-component.model";

export class ReadyComponentController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getReadyComponents));
    this.router.post("", responseHandler(this.addReadyComponent));
  }

  async getReadyComponents(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const readyComponentResult = await readyComponentService.getReadyComponents();
    return readyComponentResult;
  }

  async addReadyComponent(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const readyComponentResult = await readyComponentService.addReadyComponent(
      new ReadyComponent(req.body)
    );
    return readyComponentResult._doc;
  }
}
