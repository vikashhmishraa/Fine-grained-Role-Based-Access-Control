import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "create_user"
  description: String,
});


exports.Permission = mongoose.model("Permission", permissionSchema);

export default exports;
