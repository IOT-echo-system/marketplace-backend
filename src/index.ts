import {permissions} from "./utils/permissions";

const getRole = async (type: keyof typeof permissions) => {
  const role = await strapi.query('plugin::users-permissions.role').findOne({
    where: {type}
  });

  if (!role) {
    return await strapi.query('plugin::users-permissions.role').create({
      data: {type, name: type.charAt(0).toUpperCase() + type.slice(1), description: `Role for ${type}`}
    });
  }
  return role;
};

const addPermissionFor = async (type: keyof typeof permissions) => {
  const role = await getRole(type);
  await strapi.query('plugin::users-permissions.permission').update({
    where: {role: role.id},
    data: {enabled: false},
  });

  for (const permission of permissions[type]) {
    const existingPermission = await strapi.query('plugin::users-permissions.permission').findOne({
      where: {
        role: role.id,
        action: permission.action,
      },
    });

    if (existingPermission) {
      await strapi.query('plugin::users-permissions.permission').update({
        where: {id: existingPermission.id},
        data: {enabled: true},
      });
    } else {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          role: role.id,
          action: permission.action,
          enabled: true,
        },
      });
    }
  }
}

export default {
  register({strapi}) {
  },

  async bootstrap({strapi}) {
    const permissionsToEnable = {
      public: [
        {action: 'api::contact.contact.create'},
      ]
    };

    await addPermissionFor('public');
    await addPermissionFor('authenticated');
    await addPermissionFor('seller');
  }
}
