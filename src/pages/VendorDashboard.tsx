import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  Plus, 
  User, 
  Upload, 
  X,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { ProductEnhanced, ProductEnhancedCreate, ProductCategory, ProductStatus } from '@/types';

export default function VendorDashboard() {
  const [products, setProducts] = useState<ProductEnhanced[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId] = useState<string>('demo-vendor-id');
  
  const [newProduct, setNewProduct] = useState<ProductEnhancedCreate>({
    vendor_id: vendorId,
    name: '',
    description: '',
    price: 0,
    category: ProductCategory.OTHER,
    quantity: 0,
    image_urls: []
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [vendorId]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products-enhanced?vendor_id=${vendorId}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles([...imageFiles, ...files]);
      
      const urls = files.map(file => URL.createObjectURL(file));
      setNewProduct({
        ...newProduct,
        image_urls: [...newProduct.image_urls, ...urls]
      });
    }
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newUrls = newProduct.image_urls.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setNewProduct({
      ...newProduct,
      image_urls: newUrls
    });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products-enhanced`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newProduct, vendor_id: vendorId }),
      });

      if (response.ok) {
        alert('Product submitted for review!');
        setNewProduct({
          vendor_id: vendorId,
          name: '',
          description: '',
          price: 0,
          category: ProductCategory.OTHER,
          quantity: 0,
          image_urls: []
        });
        setImageFiles([]);
        fetchProducts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to submit product'}`);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Failed to submit product. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PENDING:
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case ProductStatus.APPROVED:
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case ProductStatus.REJECTED:
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Store className="w-12 h-12 text-brand-gold" />
            <div>
              <h1 className="text-4xl font-heading font-bold">Vendor Dashboard</h1>
              <p className="text-xl text-gray-300">Manage your products and profile</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="add-product">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="border-2 border-brand-gold">
              <CardHeader className="bg-brand-gold">
                <CardTitle className="text-2xl text-brand-black">My Products</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {products.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      You haven't added any products yet. Click the "Add Product" tab to get started!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Product</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Quantity</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-brand-black">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {product.image_urls.length > 0 && (
                                  <img
                                    src={product.image_urls[0]}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 capitalize">{product.category}</td>
                            <td className="py-3 px-4 font-medium">${product.price.toFixed(2)}</td>
                            <td className="py-3 px-4">{product.quantity}</td>
                            <td className="py-3 px-4">{getStatusBadge(product.status)}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {new Date(product.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <Card className="border-2 border-brand-gold">
              <CardHeader className="bg-brand-gold">
                <CardTitle className="text-2xl text-brand-black">Add New Product</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitProduct} className="space-y-6">
                  <Alert className="bg-brand-ivory border-brand-gold">
                    <AlertDescription className="text-gray-700">
                      All products are subject to admin review before appearing in the marketplace. 
                      You'll be notified once your product is approved.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="name" className="text-brand-black">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={handleProductChange}
                      className="mt-1"
                      placeholder="e.g., Handmade Leather Wallet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-brand-black">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={newProduct.category}
                      onChange={handleProductChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    >
                      <option value={ProductCategory.APPAREL}>Clothing</option>
                      <option value={ProductCategory.BEAUTY}>Beauty</option>
                      <option value={ProductCategory.JEWELRY}>Jewelry</option>
                      <option value={ProductCategory.FOOD}>Food</option>
                      <option value={ProductCategory.ART}>Art</option>
                      <option value={ProductCategory.BOOKS}>Books</option>
                      <option value={ProductCategory.HOME}>Home Goods</option>
                      <option value={ProductCategory.WELLNESS}>Wellness</option>
                      <option value={ProductCategory.TECH}>Tech</option>
                      <option value={ProductCategory.OTHER}>Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-brand-black">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      value={newProduct.description}
                      onChange={handleProductChange}
                      className="mt-1"
                      rows={4}
                      placeholder="Describe your product in detail..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-brand-black">Price ($) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={newProduct.price}
                        onChange={handleProductChange}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quantity" className="text-brand-black">Quantity Available *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        required
                        value={newProduct.quantity}
                        onChange={handleProductChange}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-brand-black">Product Images *</Label>
                    <div className="mt-2">
                      <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-brand-gold transition-colors">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">Click to upload product images</span>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {newProduct.image_urls.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {newProduct.image_urls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md"
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
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitLoading || newProduct.image_urls.length === 0}
                    className="w-full bg-brand-gold text-brand-black hover:bg-opacity-90 text-lg py-6"
                  >
                    {submitLoading ? 'Submitting...' : 'Submit Product for Review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="border-2 border-brand-gold">
              <CardHeader className="bg-brand-gold">
                <CardTitle className="text-2xl text-brand-black">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Alert>
                  <AlertDescription>
                    Profile settings coming soon! You'll be able to update your business information, 
                    contact details, and password here.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
