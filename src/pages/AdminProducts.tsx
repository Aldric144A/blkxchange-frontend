import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Shield,
  Package,
  DollarSign,
  Box
} from 'lucide-react';
import { ProductEnhanced, ProductStatus } from '@/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductEnhanced[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductEnhanced | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('admin_secret') || '';
    let secret = saved;
    if (!secret) {
      secret = prompt('Enter admin password (temporary)') || '';
      if (secret) localStorage.setItem('admin_secret', secret);
    }
    setAdminSecret(secret);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products-enhanced`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    if (!confirm('Are you sure you want to approve this product?')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/approve-product/${productId}`,
        { method: 'POST', headers: { 'X-Admin-Secret': adminSecret } }
      );

      if (response.ok) {
        alert('Product approved successfully!');
        fetchProducts();
        setSelectedProduct(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to approve product'}`);
      }
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to approve product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (productId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reject-product/${productId}`,
        { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': adminSecret },
          body: JSON.stringify({ reason })
        }
      );

      if (response.ok) {
        alert('Product rejected.');
        fetchProducts();
        setSelectedProduct(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to reject product'}`);
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
      alert('Failed to reject product. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.PENDING:
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
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
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-brand-gold" />
            <div>
              <h1 className="text-4xl font-heading font-bold">Admin Dashboard</h1>
              <p className="text-xl text-gray-300">Product Approval Review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-brand-black">{products.length}</p>
                </div>
                <Package className="w-12 h-12 text-brand-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-brand-black">
                    {products.filter(p => p.status === ProductStatus.PENDING).length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-brand-black">
                    {products.filter(p => p.status === ProductStatus.APPROVED).length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedProduct ? (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-brand-black">Product Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                  className="bg-white"
                >
                  Back to List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-brand-black">
                    {selectedProduct.name}
                  </h3>
                  {getStatusBadge(selectedProduct.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Product Information</h4>
                    
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium capitalize">{selectedProduct.category}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Box className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Quantity Available</p>
                        <p className="font-medium">{selectedProduct.quantity}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Vendor ID</p>
                      <p className="font-medium text-xs text-gray-500">{selectedProduct.vendor_id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Description</h4>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>
                </div>

                {selectedProduct.image_urls.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-brand-black text-lg mb-3">Product Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedProduct.image_urls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(selectedProduct.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Updated: {new Date(selectedProduct.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {selectedProduct.status === ProductStatus.PENDING && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => handleApprove(selectedProduct.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Approve Product'}
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProduct.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Reject Product'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <CardTitle className="text-2xl text-brand-black">Product Submissions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {products.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No products found. Products will appear here once vendors submit them.
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
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Submitted</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Actions</th>
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
                          <td className="py-3 px-4">
                            <Button
                              onClick={() => setSelectedProduct(product)}
                              variant="outline"
                              size="sm"
                              className="border-brand-gold text-brand-black hover:bg-brand-gold"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
