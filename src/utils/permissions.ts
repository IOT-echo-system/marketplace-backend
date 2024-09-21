const apiContactAction = {
  create: {action: 'api::contact.contact.create'}
}

const apiSiteInfoAction = {
  find: {action: 'api::site-info.site-info.find'}
}
const apiMainMenuAction = {
  find: {action: 'api::main-menu.main-menu.find'}
}
const apiFooterAction = {
  find: {action: 'api::footer.footer.find'}
}
const apiPageAction = {
  find: {action: 'api::page.page.find'},
  findOne: {action: 'api::page.page.findOne'}
}
const apiProductAction = {
  find: {action: 'api::product.product.find'},
  findOne: {action: 'api::product.product.findOne'}
}
const apiCategoryAction = {
  find: {action: 'api::category.category.find'},
  findOne: {action: 'api::category.category.findOne'}
}
const apiTagAction = {
  find: {action: 'api::tag.tag.find'},
  findOne: {action: 'api::tag.tag.findOne'}
}
const apiShippingAction = {
  estimateDelivery: {action: 'api::shipping.shipping.estimateDelivery'}
}

const apiUserPermissionAction = {
  changePassword: {action: 'plugin::users-permissions.auth.changePassword'},
  me: {action: 'plugin::users-permissions.user.me'},
  roleFindOne: {action: 'plugin::users-permissions.role.findOne'},
  roleFind: {action: 'plugin::users-permissions.role.find'}
}

const apiOrderAction = {
  create: {action: 'api::order.order.create'},
  find: {action: 'api::order.order.find'},
  findOne: {action: 'api::order.order.findOne'}
}

const apiDiscountCouponAction = {
  find: {action: 'api::discount-coupon.discount-coupon.find'},
  findOne: {action: 'api::discount-coupon.discount-coupon.findOne'}
}

const apiPaymentAction = {
  verifyPayment: {action: 'api::payment.payment.verifyPayment'}
}

const apiSellerAction = {
  order: {action: 'api::seller.seller.getAllOrders'},
  createOrder: {action: 'api::seller.seller.createOrder'},
  orderOne: {action: 'api::seller.seller.getOrder'},
  markAsDelivered: {action: 'api::seller.seller.markAsDelivered'},
  payAndDeliver: {action: 'api::seller.seller.payAndDeliver'},
  verifyPayment: {action: 'api::seller.seller.verifyPayment'},
  paymentStatus: {action: 'api::seller.seller.paymentStatus'},
  getProducts: {action: 'api::seller.seller.getProducts'}
}

const apiAddressAction = {
  create: {action: 'api::address.address.create'},
  delete: {action: 'api::address.address.delete'},
  find: {action: 'api::address.address.find'},
  findOne: {action: 'api::address.address.findOne'},
  update: {action: 'api::address.address.update'}
}

const apiAddressBySellerAction = {
  create: {action: 'api::address-by-seller.address-by-seller.create'},
  find: {action: 'api::address-by-seller.address-by-seller.find'},
  findOne: {action: 'api::address-by-seller.address-by-seller.findOne'},
  update: {action: 'api::address-by-seller.address-by-seller.update'}
}

const basePermission = [
  apiSiteInfoAction.find,
  apiMainMenuAction.find,
  apiFooterAction.find,
  apiPageAction.find,
  apiPageAction.findOne,
  apiProductAction.find,
  apiProductAction.findOne,
  apiCategoryAction.find,
  apiCategoryAction.findOne,
  apiTagAction.find,
  apiTagAction.findOne,
  apiShippingAction.estimateDelivery,
  apiDiscountCouponAction.findOne,
  apiDiscountCouponAction.find,
  apiSellerAction.verifyPayment
]

export const permissions = {
  public: [...basePermission, apiContactAction.create],
  authenticated: [
    ...basePermission,
    apiContactAction.create,
    apiAddressAction.create,
    apiAddressAction.delete,
    apiAddressAction.find,
    apiAddressAction.findOne,
    apiAddressAction.update,
    apiOrderAction.create,
    apiOrderAction.find,
    apiOrderAction.findOne,
    apiPaymentAction.verifyPayment,
    apiUserPermissionAction.roleFind,
    apiUserPermissionAction.roleFindOne
  ],
  seller: [
    ...basePermission,
    apiUserPermissionAction.changePassword,
    apiUserPermissionAction.me,
    apiUserPermissionAction.roleFind,
    apiUserPermissionAction.roleFindOne,
    apiSellerAction.order,
    apiSellerAction.orderOne,
    apiSellerAction.markAsDelivered,
    apiSellerAction.createOrder,
    apiSellerAction.payAndDeliver,
    apiSellerAction.paymentStatus,
    apiSellerAction.getProducts,
    apiAddressBySellerAction.create,
    apiAddressBySellerAction.find,
    apiAddressBySellerAction.findOne,
    apiAddressBySellerAction.update
  ]
} as const
