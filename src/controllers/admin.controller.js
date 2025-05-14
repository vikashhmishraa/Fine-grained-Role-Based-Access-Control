import User from '../models/users.model.js';


// route: POST /admin/create-user
export const createUserByAdmin = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (!['admin', 'subadmin', 'travel-agent'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered" });
      }
  
      const user = await User.create({ name, email, password, role });
  
      res.status(201).json({ message: `${role} created successfully`, user: { name, email, role } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  