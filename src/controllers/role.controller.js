import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";


const createRole = async (req, res) => {
  const { name, permissionIds } = req.body;

  const role = await Role.create({ name, permissions: permissionIds });

  res.json(role);
};

const getRoles = async (req, res) => {
  const roles = await Role.find().populate("permissions");
  res.json(roles);
};

export {
  createRole,
  getRoles
}