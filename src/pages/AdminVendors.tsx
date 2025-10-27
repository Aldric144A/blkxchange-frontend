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
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Plus,
  Upload,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { VendorApplication, VendorApplicationStatus } from '@/types';
import { AddVendorModal } from '@/components/AddVendorModal';
import { BulkImportModal } from '@/components/BulkImportModal';
import { TestModeToggle } from '@/components/TestModeToggle';

interface LiveVendor {
  id: string;
  email: string;
  name: string;
  business_name: string;
  business_description: string;
  phone?: string;
  verified: boolean;
  membership_tier: string;
  total_sales: number;
  community_contribution: number;
  created_at: string;
}

export default function AdminVendors() {
  const [activeTab, setActiveTab] = useState<'live' | 'pending'>('live');
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [liveVendors, setLiveVendors] = useState<LiveVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [editingVendor, setEditingVendor] = useState<LiveVendor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_secret') || '';
    let secret = saved;
    if (!secret) {
      secret = prompt('🔐 Enter Admin Password\n\nDefault password: changeme\n\nThis password is required to access the admin dashboard.') || '';
      if (secret) {
        localStorage.setItem('admin_secret', secret);
      } else {
        alert('⚠️ Admin password is required to access this page. Please reload and enter the password.');
      }
    }
    setAdminSecret(secret);
    if (secret) {
      fetchApplications(secret);
      fetchLiveVendors(secret);
    }
  }, []);

  const fetchApplications = async (secretParam?: string) => {
    const secret = secretParam ?? adminSecret;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor-applications`, {
        headers: { 'X-Admin-Secret': secret }
      });
      if (!response.ok) {
        throw new Error('Unauthorized');
      }
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Unauthorized. Please reload and enter the correct admin password.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveVendors = async (secretParam?: string) => {
    const secret = secretParam ?? adminSecret;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors`, {
        headers: { 'X-Admin-Secret': secret }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const data = await response.json();
      setLiveVendors(data);
    } catch (error) {
      console.error('Error fetching live vendors:', error);
    }
  };

  const handleEditVendor = async (vendorId: string, updatedData: Partial<LiveVendor>) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/${vendorId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminSecret
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (response.ok) {
        alert('Vendor updated successfully!');
        fetchLiveVendors();
        setEditingVendor(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to update vendor'}`);
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId: string, businessName: string) => {
    if (!confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vendors/${vendorId}`,
        {
          method: 'DELETE',
          headers: { 'X-Admin-Secret': adminSecret }
        }
      );

      if (response.ok) {
        alert('Vendor deleted successfully!');
        fetchLiveVendors();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to delete vendor'}`);
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this vendor application?')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/approve-vendor/${applicationId}`,
        { method: 'POST', headers: { 'X-Admin-Secret': adminSecret } }
      );

      if (response.ok) {
        alert('Vendor application approved successfully!');
        fetchApplications();
        setSelectedApplication(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to approve application'}`);
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reject-vendor/${applicationId}`,
        { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': adminSecret },
          body: JSON.stringify({ reason })
        }
      );

      if (response.ok) {
        alert('Vendor application rejected.');
        fetchApplications();
        setSelectedApplication(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to reject application'}`);
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: VendorApplicationStatus) => {
    switch (status) {
      case VendorApplicationStatus.PENDING:
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case VendorApplicationStatus.APPROVED:
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case VendorApplicationStatus.REJECTED:
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
          <p className="text-gray-600">Loading applications...</p>
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
              <p className="text-xl text-gray-300">Vendor Application Review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'live'
                ? 'border-b-4 border-brand-gold text-brand-gold'
                : 'text-gray-600 hover:text-brand-gold'
            }`}
          >
            <Store className="w-5 h-5 inline mr-2" />
            Live Vendors ({liveVendors.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'border-b-4 border-brand-gold text-brand-gold'
                : 'text-gray-600 hover:text-brand-gold'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            Pending Applications ({applications.filter(a => a.status === VendorApplicationStatus.PENDING).length})
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'live' ? 'Total Live Vendors' : 'Total Applications'}
                  </p>
                  <p className="text-3xl font-bold text-brand-black">
                    {activeTab === 'live' ? liveVendors.length : applications.length}
                  </p>
                </div>
                <Store className="w-12 h-12 text-brand-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {activeTab === 'live' ? 'Verified Vendors' : 'Pending Review'}
                  </p>
                  <p className="text-3xl font-bold text-brand-black">
                    {activeTab === 'live' 
                      ? liveVendors.filter(v => v.verified).length
                      : applications.filter(a => a.status === VendorApplicationStatus.PENDING).length
                    }
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
                  <p className="text-sm text-gray-600">
                    {activeTab === 'live' ? 'Total Sales' : 'Approved'}
                  </p>
                  <p className="text-3xl font-bold text-brand-black">
                    {activeTab === 'live'
                      ? `$${liveVendors.reduce((sum, v) => sum + v.total_sales, 0).toFixed(2)}`
                      : applications.filter(a => a.status === VendorApplicationStatus.APPROVED).length
                    }
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Content */}
        {activeTab === 'live' ? (
          // Live Vendors Tab
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-brand-black">Live Vendors</CardTitle>
                <Button
                  onClick={() => fetchLiveVendors()}
                  variant="outline"
                  className="bg-white border-black hover:bg-gray-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {liveVendors.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No live vendors found. Vendors will appear here once approved.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Business Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Owner</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Contact</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Total Sales</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Joined</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveVendors.map((vendor) => (
                        <tr key={vendor.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{vendor.business_name}</td>
                          <td className="py-3 px-4">{vendor.name}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-gray-600">{vendor.email}</p>
                              {vendor.phone && <p className="text-gray-600">{vendor.phone}</p>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {vendor.verified ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="w-3 h-3 mr-1" />Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-gray-400">Unverified</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">${vendor.total_sales.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(vendor.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setEditingVendor(vendor)}
                                variant="outline"
                                size="sm"
                                className="border-brand-gold text-brand-black hover:bg-brand-gold"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteVendor(vendor.id, vendor.business_name)}
                                variant="outline"
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                disabled={actionLoading}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        ) : selectedApplication ? (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-brand-black">Application Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
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
                    {selectedApplication.business_name}
                  </h3>
                  {getStatusBadge(selectedApplication.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Contact Information</h4>
                    
                    <div className="flex items-start gap-3">
                      <Store className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Contact Name</p>
                        <p className="font-medium">{selectedApplication.contact_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{selectedApplication.address}</p>
                      </div>
                    </div>

                    {selectedApplication.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-brand-gold mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a 
                            href={selectedApplication.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-brand-gold hover:underline"
                          >
                            {selectedApplication.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Product Information</h4>
                    
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-medium capitalize">{selectedApplication.category}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Price Range</p>
                      <p className="font-medium">{selectedApplication.price_range}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Fulfillment Method</p>
                      <p className="font-medium capitalize">{selectedApplication.fulfillment_method}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium text-gray-700">{selectedApplication.description}</p>
                    </div>
                  </div>
                </div>

                {selectedApplication.image_urls.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-brand-black text-lg mb-3">Product Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedApplication.image_urls.map((url, index) => (
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
                    Submitted: {new Date(selectedApplication.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Agreement Accepted: {selectedApplication.agreement_accepted ? 'Yes' : 'No'}
                  </p>
                </div>

                {selectedApplication.status === VendorApplicationStatus.PENDING && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Approve Application'}
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedApplication.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {actionLoading ? 'Processing...' : 'Reject Application'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl text-brand-black">Vendor Applications</CardTitle>
                <TestModeToggle 
                  onTestModeChange={setTestMode}
                  
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-brand-black">
                  {testMode ? (
                    <span className="font-semibold">🧪 Test Mode Active - Entries will not be published to live site</span>
                  ) : (
                    <span className="font-semibold">✅ Live Mode - Entries will be published after approval</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowBulkImportModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bulk Import
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold border-2 border-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {applications.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No vendor applications found. Applications will appear here once vendors submit them.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Business Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Contact</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Submitted</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application) => (
                        <tr key={application.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{application.business_name}</td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p>{application.contact_name}</p>
                              <p className="text-gray-600">{application.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{application.category}</td>
                          <td className="py-3 px-4">{getStatusBadge(application.status)}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(application.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              onClick={() => setSelectedApplication(application)}
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

      <AddVendorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchApplications();
          setShowAddModal(false);
        }}
        
        testMode={testMode}
      />

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onSuccess={() => {
          fetchApplications();
          setShowBulkImportModal(false);
        }}
        
        type="vendors"
        apiEndpoint="/api/admin/vendors/import"
        templateUrl="/templates/vendors-template.csv"
        requiredFields={['business_name', 'owner_name', 'email', 'phone', 'description', 'category', 'address', 'zip', 'status']}
      />

      {/* Edit Vendor Modal */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-brand-gold p-6 sticky top-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-brand-black">Edit Vendor</h2>
                <Button
                  onClick={() => setEditingVendor(null)}
                  variant="outline"
                  className="bg-white"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updatedData = {
                    name: formData.get('name') as string,
                    business_name: formData.get('business_name') as string,
                    business_description: formData.get('business_description') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string || undefined,
                  };
                  handleEditVendor(editingVendor.id, updatedData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingVendor.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    defaultValue={editingVendor.business_name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    name="business_description"
                    defaultValue={editingVendor.business_description}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingVendor.email}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingVendor.phone || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditingVendor(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
