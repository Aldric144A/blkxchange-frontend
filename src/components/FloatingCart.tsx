import { useState, useEffect } from 'react';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCart, removeFromCart, updateCartItemQuantity, getCartTotal, getCartItemCount, clearCart, CartItem } from '../utils/cart';

export default function FloatingCart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  const updateCartState = () => {
    setCart(getCart());
    setItemCount(getCartItemCount());
  };

  useEffect(() => {
    updateCartState();

    const handleCartUpdate = () => {
      updateCartState();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    updateCartState();
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
    updateCartState();
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      updateCartState();
    }
  };

  const handleCheckout = () => {
    alert('Payment processing coming soon — secure checkout integration in progress.');
  };

  if (itemCount === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-brand-gold text-brand-black rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center gap-2"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Panel */}
          <Card className="relative w-full md:w-96 h-full md:h-auto md:max-h-[90vh] m-0 md:m-6 rounded-none md:rounded-lg shadow-2xl flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-heading">
                  🛒 Cart ({itemCount})
                </CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        {item.vendor_name && (
                          <p className="text-xs text-brand-gold">by {item.vendor_name}</p>
                        )}
                        <p className="text-lg font-bold text-brand-black mt-1">
                          ${item.price.toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-brand-gold">${getCartTotal().toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-brand-gold text-brand-black hover:bg-opacity-90 font-semibold text-lg py-6"
                >
                  Checkout
                </Button>

                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="w-full border-red-500 text-red-500 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
