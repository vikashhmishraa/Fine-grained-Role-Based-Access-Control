// rolesPermissions.js

const roles = {
  admin: {
    can: ["create_user", "delete_user", "view_reports", "manage_roles", "okay"],
  },
  sub_admin: {
    can: ["create_user", "view_reports"],
  },
  user: {
    can: ["view_leads", "buy_leads", "view_profile", "update_profile"],
  },
};

export default roles;


