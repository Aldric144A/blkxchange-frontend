import { Product, Professional, Vendor, ImpactStats } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
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
  }
};
