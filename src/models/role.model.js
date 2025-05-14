import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "admin"
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});


export default mongoose.model("Role", roleSchema);