import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const widgetSchema: Schema = new Schema({
  type: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: false },
  sortByColumn: { type: String, required: false },
  sortByDirection: { type: String, required: false },
  pictureField: { type: String, required: false },
  titleField: { type: String, required: false },
  picturesPerPage: { type: Number, required: false },
  fixedWidth: { type: Number, required: false },
  rowHeight: { type: Number, required: false },
  align: { type: String, required: false },
  direction: { type: String, required: false },
  repeatHeader: { type: Boolean, required: false },
  headerAppearance: { type: Schema.Types.Mixed, required: false },
  columns: { type: [Schema.Types.Mixed], required: false },
  filters: { type: [Schema.Types.Mixed], required: false },
});

widgetSchema.plugin(uniqueValidator);

export default mongoose.model("Widget", widgetSchema);
