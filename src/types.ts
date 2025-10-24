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
  REAL_ESTATE = "real_estate",
  BARBERS_BEAUTY = "barbers_beauty",
  PHOTOGRAPHY_DESIGN = "photography_design",
  AUTOMOTIVE_HOUSING = "automotive_housing",
  MEDIA_MARKETING = "media_marketing",
  NONPROFITS = "nonprofits",
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
  vendor_name?: string;
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
  website?: string;
  image_url?: string;
  verified: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  distance_miles?: number;
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

export enum VendorApplicationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum ProductStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum FulfillmentMethod {
  SHIPPING = "shipping",
  LOCAL = "local"
}

export enum PriceRange {
  UNDER_25 = "<$25",
  RANGE_25_50 = "$25-$50",
  RANGE_50_100 = "$50-$100",
  OVER_100 = ">$100"
}

export interface VendorApplication {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  category: ProductCategory;
  description: string;
  price_range: PriceRange;
  fulfillment_method: FulfillmentMethod;
  image_urls: string[];
  status: VendorApplicationStatus;
  agreement_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorApplicationCreate {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website?: string;
  category: ProductCategory;
  description: string;
  price_range: PriceRange;
  fulfillment_method: FulfillmentMethod;
  image_urls: string[];
  agreement_accepted: boolean;
}

export interface VendorAccount {
  id: string;
  vendor_id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export interface ProductEnhanced {
  id: string;
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  quantity: number;
  image_urls: string[];
  status: ProductStatus;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductEnhancedCreate {
  vendor_id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  quantity: number;
  image_urls: string[];
}

export interface StartupApplication {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  website?: string;
  funding_goal: number;
  business_summary: string;
  pitch_deck_url?: string;
  agreement_accepted: boolean;
  created_at: string;
}

export interface StartupApplicationCreate {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  website?: string;
  funding_goal: number;
  business_summary: string;
  pitch_deck_url?: string;
  agreement_accepted: boolean;
}

export interface AngelInvestor {
  id: string;
  name: string;
  email: string;
  company?: string;
  accreditation_type: string;
  investment_range: string;
  interests: string[];
  agreement_accepted: boolean;
  created_at: string;
}

export interface AngelInvestorCreate {
  name: string;
  email: string;
  company?: string;
  accreditation_type: string;
  investment_range: string;
  interests: string[];
  agreement_accepted: boolean;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: number;
  institution: string;
  created_at: string;
}

export interface DonationCreate {
  donor_name: string;
  email: string;
  amount: number;
  institution: string;
}

export interface BlackBank {
  id: string;
  name: string;
  description: string;
  location: string;
  affiliate_link: string;
}

export interface InvestImpactStats {
  total_funds_reinvested: number;
  hbcu_donations: number;
  startup_investments: number;
  angel_investors_count: number;
  businesses_supported: number;
}
