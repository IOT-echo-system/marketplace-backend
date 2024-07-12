import type { Schema, Attribute } from '@strapi/strapi';

export interface AddressAddress extends Schema.Component {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'Address';
  };
  attributes: {
    address1: Attribute.String;
    address2: Attribute.String;
    address3: Attribute.String;
    city: Attribute.String;
    state: Attribute.String;
    pin: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 100000;
          max: 999999;
        },
        number
      >;
    name: Attribute.String & Attribute.Required;
    phone: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1000000000;
          max: 9999999999;
        },
        number
      >;
  };
}

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

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'address.address': AddressAddress;
      'cta.cta': CtaCta;
      'hero-banner.hero-banner': HeroBannerHeroBanner;
      'image.image': ImageImage;
      'nav-link.nav-link': NavLinkNavLink;
    }
  }
}
