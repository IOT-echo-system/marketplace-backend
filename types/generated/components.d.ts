import type {Schema, Attribute} from '@strapi/strapi'

export interface AddressAddress extends Schema.Component {
  collectionName: 'components_address_addresses'
  info: {
    displayName: 'Address'
  }
  attributes: {
    name: Attribute.String & Attribute.Required
    address1: Attribute.String & Attribute.Required
    address2: Attribute.String
    address3: Attribute.String
    city: Attribute.String & Attribute.Required
    district: Attribute.String & Attribute.Required
    state: Attribute.String & Attribute.Required
    pinCode: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 100000
          max: 999999
        },
        number
      >
    mobileNo: Attribute.BigInteger &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: '1000000000'
          max: '9999999999'
        },
        string
      >
  }
}

export interface CtaCta extends Schema.Component {
  collectionName: 'components_cta_ctas'
  info: {
    displayName: 'CTA'
  }
  attributes: {
    label: Attribute.String & Attribute.Required
    link: Attribute.String & Attribute.Required
  }
}

export interface DiscountCouponDiscountCoupon extends Schema.Component {
  collectionName: 'components_discount_coupon_discount_coupons'
  info: {
    displayName: 'Discount coupon'
  }
  attributes: {
    code: Attribute.String & Attribute.Required
    discount: Attribute.Integer & Attribute.Required
  }
}

export interface HeroBannerHeroBanner extends Schema.Component {
  collectionName: 'components_hero_banner_hero_banners'
  info: {
    displayName: 'Hero banner'
    description: ''
  }
  attributes: {
    image: Attribute.Component<'image.image'> & Attribute.Required
    mobileImage: Attribute.Component<'image.image'>
    title: Attribute.Text
    subtitle: Attribute.Text
    cta: Attribute.Component<'cta.cta'>
    darkText: Attribute.Boolean & Attribute.DefaultTo<false>
  }
}

export interface ImageImage extends Schema.Component {
  collectionName: 'components_image_images'
  info: {
    displayName: 'Image'
  }
  attributes: {
    link: Attribute.String & Attribute.Required
    altText: Attribute.String
  }
}

export interface ProductProduct extends Schema.Component {
  collectionName: 'components_product_products'
  info: {
    displayName: 'Order Product'
    description: ''
  }
  attributes: {
    title: Attribute.String & Attribute.Required
    price: Attribute.Decimal &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
    qty: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1
        },
        number
      >
    shortDescription: Attribute.Text
    featuredImage: Attribute.Component<'image.image'>
    slug: Attribute.String & Attribute.Required
    productId: Attribute.String & Attribute.Required
  }
}

export interface SectionSection extends Schema.Component {
  collectionName: 'components_section_sections'
  info: {
    displayName: 'Section'
    description: ''
  }
  attributes: {
    title: Attribute.String
    ctas: Attribute.Component<'cta.cta', true> &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 2
        },
        number
      >
  }
}

export interface SocialSocial extends Schema.Component {
  collectionName: 'components_social_socials'
  info: {
    displayName: 'Social'
    description: ''
  }
  attributes: {
    icon: Attribute.Enumeration<['Facebook', 'Instagram', 'YouTube', 'LinkedIn']> & Attribute.Required
    cta: Attribute.Component<'cta.cta'> & Attribute.Required
  }
}

export interface TextContentTextContent extends Schema.Component {
  collectionName: 'components_text_content_text_contents'
  info: {
    displayName: 'TextContent'
  }
  attributes: {
    text: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML'
          preset: 'standard'
        }
      >
  }
}

export interface TextWithCtaTextWithCta extends Schema.Component {
  collectionName: 'components_text_with_cta_text_with_ctas'
  info: {
    displayName: 'Text with cta'
    description: ''
  }
  attributes: {
    cta: Attribute.Component<'cta.cta'> & Attribute.Required
    text: Attribute.String & Attribute.Required
  }
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'address.address': AddressAddress
      'cta.cta': CtaCta
      'discount-coupon.discount-coupon': DiscountCouponDiscountCoupon
      'hero-banner.hero-banner': HeroBannerHeroBanner
      'image.image': ImageImage
      'product.product': ProductProduct
      'section.section': SectionSection
      'social.social': SocialSocial
      'text-content.text-content': TextContentTextContent
      'text-with-cta.text-with-cta': TextWithCtaTextWithCta
    }
  }
}
