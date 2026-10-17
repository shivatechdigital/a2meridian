export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  hsCode: string;
  description: string;
  images: string[];
  originCountry: string;
  tradeType: "import" | "export" | "both";
  specifications: { key: string; value: string }[];
  certifications: string[];
  moq: string;
  isFeatured: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
  region: string;
  tradeType: "import" | "export" | "both";
  products: string[];
}

export interface Certification {
  name: string;
  issuingBody: string;
  certificateNumber: string;
  validUntil: string;
  image: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  productInterest: string;
  message: string;
}