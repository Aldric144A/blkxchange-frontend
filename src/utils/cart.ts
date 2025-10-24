/**
 * Cart utility functions for BlkXchange™
 * Handles localStorage-based cart management
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  vendor_name?: string;
}

const CART_STORAGE_KEY = 'blkxchange_cart';

export const getCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const addToCart = (product: {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  vendor_name?: string;
}): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      vendor_name: product.vendor_name,
    });
  }

  saveCart(cart);
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
};

export const updateCartItemQuantity = (productId: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
};

export const clearCart = (): void => {
  saveCart([]);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
