import mongoose, { Mongoose } from "mongoose";

export default class DatabaseConnector {
  public connect(): Promise<Mongoose> {
    return new Promise<Mongoose>((resolve, reject) => {
      mongoose.set("useNewUrlParser", true);
      mongoose.set("useFindAndModify", false);
      mongoose.set("useCreateIndex", true);
      mongoose
        .connect(
          process.env.databaseUrl
            ? process.env.databaseUrl
            : "mongodb+srv://admin:Iq83ilABPTZW!hk@cluster0-rpim1.mongodb.net/reports?retryWrites=true&w=majority"
        )
        .then((db) => {
          console.log("Connected to database!");
          resolve(db);
        })
        .catch((error) => {
          console.log("Connection failed!");
          reject(error);
        });
    });
  }
}
