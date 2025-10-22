import { 
  Product, Professional, Vendor, ImpactStats,
  StartupApplication, StartupApplicationCreate,
  AngelInvestor, AngelInvestorCreate,
  Donation, DonationCreate,
  BlackBank, InvestImpactStats
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_BASE_URL = API_URL;

export const api = {
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response.json();
  },

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getProducts(category?: string): Promise<Product[]> {
    const url = category 
      ? `${API_URL}/api/products?category=${category}`
      : `${API_URL}/api/products`;
    const response = await fetch(url);
    return response.json();
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/api/products/${id}`);
    return response.json();
  },

  async getVendors(): Promise<Vendor[]> {
    const response = await fetch(`${API_URL}/api/vendors`);
    return response.json();
  },

  async getVendor(id: string): Promise<Vendor> {
    const response = await fetch(`${API_URL}/api/vendors/${id}`);
    return response.json();
  },

  async getProfessionals(category?: string): Promise<Professional[]> {
    const url = category 
      ? `${API_URL}/api/professionals?category=${category}`
      : `${API_URL}/api/professionals`;
    const response = await fetch(url);
    return response.json();
  },

  async getProfessional(id: string): Promise<Professional> {
    const response = await fetch(`${API_URL}/api/professionals/${id}`);
    return response.json();
  },

  async getImpactStats(): Promise<ImpactStats> {
    const response = await fetch(`${API_URL}/api/impact`);
    return response.json();
  },

  async createStartupApplication(data: StartupApplicationCreate): Promise<StartupApplication> {
    const response = await fetch(`${API_URL}/api/startup-applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getStartupApplications(): Promise<StartupApplication[]> {
    const response = await fetch(`${API_URL}/api/startup-applications`);
    return response.json();
  },

  async createAngelInvestor(data: AngelInvestorCreate): Promise<AngelInvestor> {
    const response = await fetch(`${API_URL}/api/angel-investors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getAngelInvestors(): Promise<AngelInvestor[]> {
    const response = await fetch(`${API_URL}/api/angel-investors`);
    return response.json();
  },

  async createDonation(data: DonationCreate): Promise<Donation> {
    const response = await fetch(`${API_URL}/api/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async getDonations(): Promise<Donation[]> {
    const response = await fetch(`${API_URL}/api/donations`);
    return response.json();
  },

  async getBlackBanks(): Promise<BlackBank[]> {
    const response = await fetch(`${API_URL}/api/black-banks`);
    return response.json();
  },

  async getInvestImpactStats(): Promise<InvestImpactStats> {
    const response = await fetch(`${API_URL}/api/invest-impact`);
    return response.json();
  }
};
