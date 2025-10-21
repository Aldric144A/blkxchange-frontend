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
  Globe
} from 'lucide-react';
import { VendorApplication, VendorApplicationStatus } from '@/types';

export default function AdminVendors() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
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
    fetchApplications(secret);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-brand-black">{applications.length}</p>
                </div>
                <Store className="w-12 h-12 text-brand-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-3xl font-bold text-brand-black">
                    {applications.filter(a => a.status === VendorApplicationStatus.PENDING).length}
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
                    {applications.filter(a => a.status === VendorApplicationStatus.APPROVED).length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedApplication ? (
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
              <CardTitle className="text-2xl text-brand-black">Vendor Applications</CardTitle>
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
    </div>
  );
}
