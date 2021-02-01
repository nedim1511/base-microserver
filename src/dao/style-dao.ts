import { BaseDao } from "./base-dao";
import Style from "../models/style.model";

export class StyleDao extends BaseDao {
  public async findOneAndUpdate(updatedModel: any) {
    try {
      return await Style.findOneAndUpdate(
        { key: updatedModel.key },
        updatedModel,
        {
          new: true,
          upsert: true,
        }
      );
    } catch (error) {
      throw { message: "Can't edit style", error };
    }
  }
}
