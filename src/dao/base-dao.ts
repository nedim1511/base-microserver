export class BaseDao {
  protected async create(objectModel: any) {
    try {
      objectModel.createdTime = new Date();
      const createdObject = await objectModel.save();
      return  {
          ...createdObject,
          id: createdObject._id
      };
    } catch(error) {
      throw {message: "Can't create object", error};
    }
  }

  protected async findOne(objectModel, parameters) {
    try {
      return await objectModel.findOne(parameters);
    } catch(error) {
      throw {message: "Can't find object", error};
    }
  }

  protected async deleteOne(objectModel, parameters) {
    try {
      return await objectModel.deleteOne(parameters);
    } catch(error) {
      throw {message: "Can't delete object", error};
    }
  }

  protected async deleteMany(objectModel, parameters) {
    try {
      return await objectModel.deleteMany(parameters);
    } catch(error) {
      throw {message: "Can't delete objects", error};
    }
  }

  protected async find(objectModel, parameters) {
    try {
      return await objectModel.find(parameters);
    } catch(error) {
      throw {message: "Can't find objects", error};
    }
  }
}