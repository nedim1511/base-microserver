import * as express from "express";
import responseHandler = require("../middleware/response-handle");
import ReadyComponentService from "../services/ready-component-service";

export class ReadyComponentController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getReadyComponents));
  }

  async getReadyComponents(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const readyComponentResult = await readyComponentService.getReadyComponents();
    return readyComponentResult;
  }
}
