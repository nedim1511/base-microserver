import { StyleDao } from "../dao/style-dao";
import Style from "../models/style.model";

export default class StyleService {
  private styleDao: StyleDao;

  constructor(styleDao: any) {
    this.styleDao = styleDao;
  }

  async getStyles(params: any = {}) {
    return await this.styleDao.find(Style, params);
  }

  async getById(key: string) {
    return await this.styleDao.findOne(Style, { key });
  }

  async addStyle(model: any) {
    return await this.styleDao.create(model);
  }

  async editStyle(model: any) {
    return await this.styleDao.findOneAndUpdate(model);
  }
}
