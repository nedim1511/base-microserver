import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const styleSchema: Schema = new Schema({
  key: { type: String, required: false },
  style: { type: [Schema.Types.Mixed], required: false },
});

styleSchema.plugin(uniqueValidator);

export default mongoose.model("Style", styleSchema);
