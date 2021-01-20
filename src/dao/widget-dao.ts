import { BaseDao } from "./base-dao";
import Widget from "../models/widget";

export class WidgetDao extends BaseDao {
  public async findOneAndUpdate(query: any, newModel: any) {
    try {
      return await Widget.findOneAndUpdate(query, newModel, { new: true });
    } catch (error) {
      throw { message: "Can't update widget", error };
    }
  }
}
