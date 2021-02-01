import * as express from "express";
import StyleService from "../services/style-service";
import responseHandler = require("../middleware/response-handle");
import Style from "../models/style.model";

export class StyleController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getStyles));
    this.router.get("/:key", responseHandler(this.getById));
    this.router.post("", responseHandler(this.addStyle));
    this.router.put("", responseHandler(this.editStyle));
  }

  async getStyles(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.getStyles();
    return styleResult;
  }

  async getById(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.getById(req.params.key);
    return styleResult;
  }

  async addStyle(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.addStyle(new Style(req.body));
    return styleResult._doc;
  }

  async editStyle(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    let updatedModel: { style?: any; key?: string } = {};
    updatedModel.style = req.body.style;
    updatedModel.key = req.body.key;
    const styleResult = await styleService.editStyle(updatedModel);
    return styleResult;
  }
}
