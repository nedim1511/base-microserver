import { WidgetDao } from "../dao/widget-dao";
import Widget from "../models/widget";

export default class WidgetService {
  private widgetDao: WidgetDao;

  constructor(widgetDao: any) {
    this.widgetDao = widgetDao;
  }

  async getWidgets() {
    return await this.widgetDao.find(Widget, {});
  }

  async create(widgetModel = {}) {
    return await this.widgetDao.create(widgetModel);
  }

  async edit(_id: string, widgetModel: any) {
    return await this.widgetDao.findOneAndUpdate({ _id }, widgetModel);
  }
}
