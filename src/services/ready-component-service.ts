import { ReadyComponentDao } from "../dao/ready-component-dao";
import ReadyComponent from "../models/ready-component.model";

export default class ReadyComponentService {
  private readyComponentDao: ReadyComponentDao;

  constructor(readyComponentDao: any) {
    this.readyComponentDao = readyComponentDao;
  }

  async getReadyComponents(params: any = {}) {
    return await this.readyComponentDao.find(ReadyComponent, params);
  }

  async addReadyComponent(model: any) {
    return await this.readyComponentDao.create(model);
  }
}
