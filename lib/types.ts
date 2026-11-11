export interface CustomizationField {
  id: string;
  type: "text" | "textarea" | "image_upload" | "select";
  label: string;
  required: boolean;
  options?: string[];
}

export type ProductCategory =
  | "vintage_letter"
  | "journaling_frame"
  | "vintage_card"
  | "phone_case"
  | "scrapbook";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: number;
  currency: string;
  images: string[];
  category: ProductCategory;
  isMakeToOrder: boolean;
  leadTimeDays: number;
  customizationFields?: CustomizationField[];
  isFeatured: boolean;
}

export interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  media_type?: "image" | "video";
  poster?: string;
}

export interface SiteSettings {
  storeName: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroParagraph: string;
  heroNote: string;
  instagramHandle: string;
  footerBlurb: string;
  defaultCurrency: string;
  defaultLeadTimeDays: number;
}
