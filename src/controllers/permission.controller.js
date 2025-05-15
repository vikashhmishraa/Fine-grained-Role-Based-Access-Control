import Permission from "../models/permission.model.js";


 const createPermission = async (req, res) => {
  const { name, description } = req.body;

  const permission = await Permission.create({ name, description });

  res.json(permission);
};

const getPermissions = async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
};

export {
  createPermission,
  getPermissions
}