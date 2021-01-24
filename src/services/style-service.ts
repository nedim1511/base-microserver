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
}
