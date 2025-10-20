export enum ProductCategory {
  APPAREL = "apparel",
  BEAUTY = "beauty",
  BOOKS = "books",
  ART = "art",
  TECH = "tech",
  FOOD = "food",
  WELLNESS = "wellness",
  HOME = "home",
  JEWELRY = "jewelry",
  OTHER = "other"
}

export enum ProfessionalCategory {
  HEALTH = "health",
  LEGAL = "legal",
  FINANCE = "finance",
  COACHING = "coaching",
  CONSULTING = "consulting",
  EDUCATION = "education",
  OTHER = "other"
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  business_name: string;
  business_description: string;
  phone?: string;
  stripe_account_id?: string;
  verified: boolean;
  total_sales: number;
  community_contribution: number;
  created_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_url?: string;
  stock: number;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface Professional {
  id: string;
  email: string;
  name: string;
  title: string;
  category: ProfessionalCategory;
  bio: string;
  credentials: string;
  hourly_rate?: number;
  phone?: string;
  image_url?: string;
  verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
}

export interface ImpactStats {
  total_donations: number;
  total_orders: number;
  total_vendors: number;
  total_professionals: number;
  hbcu_donations: number;
  scholarship_donations: number;
  nonprofit_donations: number;
}
