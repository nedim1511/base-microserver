import * as express from "express";
import responseHandler = require("../middleware/response-handle");
import ReadyComponentService from "../services/ready-component-service";
import ReadyComponent from "../models/ready-component.model";
import StyleService from "../services/style-service";

export class ReadyComponentController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getReadyComponents));
    this.router.get("/:id", responseHandler(this.getById));
    this.router.post("", responseHandler(this.addReadyComponent));
    this.router.put("", responseHandler(this.editReadyComponent));
  }

  async getReadyComponents(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const readyComponentResult = await readyComponentService.getReadyComponents();
    return readyComponentResult;
  }

  async getById(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const styleService: StyleService = req.container.resolve("styleService");
    const readyComponentResult = await readyComponentService.getById({
      _id: req.params.id,
    });
    const styleResult = await styleService.getById(readyComponentResult.key);
    console.log(styleResult);
    return { widget: readyComponentResult, style: styleResult };
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

  async editReadyComponent(req, res, next) {
    const readyComponentService: ReadyComponentService = req.container.resolve(
      "readyComponentService"
    );
    const readyComponentResult = await readyComponentService.editReadyComponent(
      new ReadyComponent(req.body)
    );
    return readyComponentResult._doc;
  }
}
