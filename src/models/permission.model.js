import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "create_user"
  description: String,
});


// export permissionSchema 
const Permission = mongoose.model("Permission", permissionSchema);
export default Permission; 