import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

export interface ITest extends Document {
  test: string;
}

const testSchema: Schema = new Schema({
  test: { type: String, required: true, unique: true },
});

testSchema.plugin(uniqueValidator);

export default mongoose.model<ITest>("Test", testSchema);
