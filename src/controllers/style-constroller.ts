import * as express from "express";
import StyleService from "../services/style-service";
import responseHandler = require("../middleware/response-handle");

export class StyleController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getStyles));
  }

  async getStyles(req, res, next) {
    const styleService: StyleService = req.container.resolve("styleService");
    const styleResult = await styleService.getStyles();
    return styleResult;
  }
}
