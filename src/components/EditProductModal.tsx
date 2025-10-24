import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductEnhanced, ProductCategory, ProductStatus } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import { Loader2, X } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: ProductEnhanced;
}

export function EditProductModal({ isOpen, onClose, onSuccess, product }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    image_urls: product.image_urls,
    status: product.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      image_urls: product.image_urls,
      status: product.status,
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adminSecret = localStorage.getItem('admin_secret');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products-enhanced/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminSecret || '',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    if (formData.image_urls.length < 5) {
      setFormData({ ...formData, image_urls: [...formData.image_urls, url] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.image_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newImages });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-black">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Product Images */}
          <div>
            <Label className="text-brand-black">Product Images (Max 5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 mb-4">
              {formData.image_urls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {formData.image_urls.length < 5 && (
              <ImageUpload
                section="products"
                imageType="product"
                isVerified={formData.status === ProductStatus.APPROVED}
                testMode={false}
                onUploadSuccess={handleImageUpload}
                label="Add Product Image"
              />
            )}
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name" className="text-brand-black">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-brand-black">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="mt-1"
            />
          </div>

          {/* Category, Price, Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category" className="text-brand-black">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ProductCategory })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductCategory.APPAREL}>Apparel</SelectItem>
                  <SelectItem value={ProductCategory.BEAUTY}>Beauty</SelectItem>
                  <SelectItem value={ProductCategory.BOOKS}>Books</SelectItem>
                  <SelectItem value={ProductCategory.ART}>Art</SelectItem>
                  <SelectItem value={ProductCategory.TECH}>Tech</SelectItem>
                  <SelectItem value={ProductCategory.FOOD}>Food</SelectItem>
                  <SelectItem value={ProductCategory.WELLNESS}>Wellness</SelectItem>
                  <SelectItem value={ProductCategory.HOME}>Home</SelectItem>
                  <SelectItem value={ProductCategory.JEWELRY}>Jewelry</SelectItem>
                  <SelectItem value={ProductCategory.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price" className="text-brand-black">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="quantity" className="text-brand-black">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-brand-black">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as ProductStatus })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProductStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ProductStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={ProductStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-gold text-brand-black hover:bg-brand-gold/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
