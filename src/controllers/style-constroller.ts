import * as express from "express";
import StyleService from "../services/style-service";
import responseHandler = require("../middleware/response-handle");
import Style from "../models/style.model";

export class StyleController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getStyles));
    this.router.post("", responseHandler(this.addStyle));
  }

  async getStyles(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.getStyles();
    return styleResult;
  }

  async addStyle(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.addStyle(new Style(req.body));
    return styleResult._doc;
  }
}
