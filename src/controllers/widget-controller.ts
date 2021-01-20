import * as express from 'express'
import WidgetService from '../services/widget.service';
import responseHandler = require('../middleware/response-handle');
import Widget from '../models/widget';

export class WidgetController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.get));
    this.router.post("", responseHandler(this.create));
    this.router.put("", responseHandler(this.edit));
  }

  async get(req, res, next) {
    const widgetService: WidgetService = req.container.resolve("widgetService");
    const widgetResult = await widgetService.getWidgets();
    return widgetResult;
  }

  async create(req, res, next) {
    const widgetService: WidgetService = req.container.resolve("widgetService");
    const widgetResult = await widgetService.create(new Widget(req.body));
    return widgetResult._doc;
  }

  async edit(req, res, next) {
    const widgetService: WidgetService = req.container.resolve("widgetService");
    const widgetResult = await widgetService.edit(req.body._id, req.body);
    return widgetResult;
  }
}
