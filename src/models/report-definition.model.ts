import mongoose, { Schema, Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const reportDefinition: Schema = new Schema({
    name: { type: String, required: false },
    settings: { type: Schema.Types.Mixed, required: false },
    general: { type: Schema.Types.Mixed, required: false },
    placeholderMetadata: { type: [Schema.Types.Mixed], required: false },
    readyComponents: { type: [Schema.Types.Mixed], required: false },
    attachments: { type: [Schema.Types.Mixed], required: false },
    style: { type: [Schema.Types.Mixed], required: false },
});

reportDefinition.plugin(uniqueValidator);

export default mongoose.model("ReportDefinition", reportDefinition);
