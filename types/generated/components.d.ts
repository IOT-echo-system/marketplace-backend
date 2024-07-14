import type { Schema, Attribute } from '@strapi/strapi';

export interface CtaCta extends Schema.Component {
  collectionName: 'components_cta_ctas';
  info: {
    displayName: 'CTA';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
  };
}

export interface HeroBannerHeroBanner extends Schema.Component {
  collectionName: 'components_hero_banner_hero_banners';
  info: {
    displayName: 'Hero Banner';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    subtitle: Attribute.String;
    cta: Attribute.Component<'cta.cta'>;
    image: Attribute.Component<'image.image'>;
    darkText: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ImageImage extends Schema.Component {
  collectionName: 'components_image_images';
  info: {
    displayName: 'Image';
  };
  attributes: {
    link: Attribute.String & Attribute.Required;
    altText: Attribute.String;
  };
}

export interface NavLinkNavLink extends Schema.Component {
  collectionName: 'components_nav_link_nav_links';
  info: {
    displayName: 'NavLink';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
  };
}

export interface ProductProduct extends Schema.Component {
  collectionName: 'components_product_products';
  info: {
    displayName: 'OrderProduct';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    price: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    qty: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    shortDescription: Attribute.Text;
    featuredImage: Attribute.Component<'image.image'>;
    slug: Attribute.String & Attribute.Required;
    productId: Attribute.String & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'cta.cta': CtaCta;
      'hero-banner.hero-banner': HeroBannerHeroBanner;
      'image.image': ImageImage;
      'nav-link.nav-link': NavLinkNavLink;
      'product.product': ProductProduct;
    }
  }
}
