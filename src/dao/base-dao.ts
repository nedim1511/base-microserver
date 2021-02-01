export class BaseDao {
  public async create(objectModel: any) {
    try {
      const createdObject = await objectModel.save();
      return {
        ...createdObject,
        id: createdObject._id,
      };
    } catch (error) {
      throw { message: "Can't create object", error };
    }
  }

  public async findOne(objectModel, parameters) {
    try {
      return await objectModel.findOne(parameters);
    } catch (error) {
      throw { message: "Can't find object", error };
    }
  }

  public async deleteOne(objectModel, parameters) {
    try {
      return await objectModel.deleteOne(parameters);
    } catch (error) {
      throw { message: "Can't delete object", error };
    }
  }

  public async deleteMany(objectModel, parameters) {
    try {
      return await objectModel.deleteMany(parameters);
    } catch (error) {
      throw { message: "Can't delete objects", error };
    }
  }

  public async find(objectModel, parameters) {
    try {
      return await objectModel.find(parameters);
    } catch (error) {
      throw { message: "Can't find objects", error };
    }
  }

  public async findOneAndUpdate(objectModel: any, updatedModel: any) {
    try {
      return await objectModel.findOneAndUpdate(
        { _id: updatedModel._id },
        updatedModel,
        {
          new: true,
          upsert: true,
        }
      );
    } catch (error) {
      throw { message: "Can't edit object", error };
    }
  }
}
