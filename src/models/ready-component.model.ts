import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const readyComponent: Schema = new Schema({
  fieldsToShow: { type: [String] },
  key: { type: String, required: false },
  type: { type: Number, required: true },
  sortByField: { type: String, required: false },
  sortByDirection: { type: String, required: false },
  filterByFieldAndValue: { type: [Schema.Types.Mixed], required: false },
  pictureField: { type: String, required: false },
  textField: { type: String, required: false },
  picturesPerPage: { type: String, required: false },
});

readyComponent.plugin(uniqueValidator);

export default mongoose.model("ReadyComponent", readyComponent);
