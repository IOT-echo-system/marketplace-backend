const apiContactAction = {
  create: {action: 'api::contact.contact.create'}
};

const apiSiteInfoAction = {
  find: {action: 'api::site-info.site-info.find'}
};
const apiMainMenuAction = {
  find: {action: 'api::main-menu.main-menu.find'}
};
const apiFooterAction = {
  find: {action: 'api::footer.footer.find'}
};
const apiPageAction = {
  find: {action: 'api::page.page.find'},
  findOne: {action: 'api::page.page.findOne'}
};
const apiProductAction = {
  find: {action: 'api::product.product.find'},
  findOne: {action: 'api::product.product.findOne'}
};
const apiCategoryAction = {
  find: {action: 'api::category.category.find'},
  findOne: {action: 'api::category.category.findOne'}
};
const apiTagAction = {
  find: {action: 'api::tag.tag.find'},
  findOne: {action: 'api::tag.tag.findOne'}
};
const apiShippingHelperAction = {
  estimateDelivery: {action: 'api::shipping-helper.shipping-helper.estimateDelivery'},
};

const apiOrderAction = {
  create: {action: 'api::order.order.create'},
  find: {action: 'api::order.order.find'},
  findOne: {action: 'api::order.order.findOne'},
};
const apiPaymentAction = {
  verifyPayment: {action: 'api::payment.payment.verifyPayment'},
};

const apiAddressAction = {
  create: {action: 'api::address.address.create'},
  delete: {action: 'api::address.address.delete'},
  find: {action: 'api::address.address.find'},
  findOne: {action: 'api::address.address.findOne'},
  update: {action: 'api::address.address.update'}
};

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
  apiShippingHelperAction.estimateDelivery
]

export const permissions = {
  public: [
    ...basePermission,
    apiContactAction.create,

  ],
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
    apiPaymentAction.verifyPayment
  ],
  seller: [
    ...basePermission,
  ]
} as const
