import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Eye, 
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Plus,
  Upload,
  Edit,
  Trash2
} from 'lucide-react';
import { Professional } from '@/types';
import { AddProfessionalModal } from '@/components/AddProfessionalModal';
import { EditProfessionalModal } from '@/components/EditProfessionalModal';
import { BulkImportModal } from '@/components/BulkImportModal';
import { TestModeToggle } from '@/components/TestModeToggle';
import { AdminToolbar } from '@/components/AdminToolbar';

export default function AdminProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
      fetchProfessionals(secret);
    }
  }, []);

  const fetchProfessionals = async (secretParam?: string) => {
    const secret = secretParam ?? adminSecret;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professionals`, {
        headers: { 'X-Admin-Secret': secret }
      });
      if (!response.ok) {
        throw new Error('Unauthorized');
      }
      const data = await response.json();
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      alert('Unauthorized. Please reload and enter the correct admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (professionalId: string) => {
    if (!confirm('Are you sure you want to delete this professional? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/professionals/${professionalId}`,
        { 
          method: 'DELETE',
          headers: { 'X-Admin-Secret': adminSecret }
        }
      );

      if (response.ok) {
        alert('Professional deleted successfully!');
        fetchProfessionals();
        setSelectedProfessional(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to delete professional'}`);
      }
    } catch (error) {
      console.error('Error deleting professional:', error);
      alert('Failed to delete professional. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12 text-brand-gold" />
              <div>
                <h1 className="text-4xl font-heading font-bold">Admin Dashboard</h1>
                <p className="text-xl text-gray-300">Professional Management</p>
              </div>
            </div>
            <AdminToolbar onRefresh={() => fetchProfessionals()} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-brand-gold">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Professionals</p>
                  <p className="text-3xl font-bold text-brand-black">{professionals.length}</p>
                </div>
                <Users className="w-12 h-12 text-brand-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-3xl font-bold text-brand-black">
                    {professionals.filter(p => p.verified).length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">With Location</p>
                  <p className="text-3xl font-bold text-brand-black">
                    {professionals.filter(p => p.latitude && p.longitude).length}
                  </p>
                </div>
                <MapPin className="w-12 h-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedProfessional ? (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-brand-black">Professional Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedProfessional(null)}
                  className="bg-white"
                >
                  Back to List
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {selectedProfessional.image_url && (
                      <img
                        src={selectedProfessional.image_url}
                        alt={selectedProfessional.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-brand-black">
                        {selectedProfessional.name}
                      </h3>
                      <p className="text-lg text-gray-600">{selectedProfessional.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="capitalize bg-brand-charcoal text-brand-gold">
                          {selectedProfessional.category}
                        </Badge>
                        {selectedProfessional.verified && (
                          <Badge className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(selectedProfessional)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(selectedProfessional.id)}
                      disabled={actionLoading}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Contact Information</h4>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-brand-gold mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedProfessional.email}</p>
                      </div>
                    </div>

                    {selectedProfessional.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-brand-gold mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{selectedProfessional.phone}</p>
                        </div>
                      </div>
                    )}

                    {(selectedProfessional.city || selectedProfessional.state || selectedProfessional.zip) && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-gold mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium">
                            {selectedProfessional.city && `${selectedProfessional.city}, `}
                            {selectedProfessional.state} {selectedProfessional.zip}
                          </p>
                          {selectedProfessional.latitude && selectedProfessional.longitude && (
                            <p className="text-xs text-gray-500 mt-1">
                              GPS: {selectedProfessional.latitude.toFixed(4)}, {selectedProfessional.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedProfessional.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-brand-gold mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a 
                            href={selectedProfessional.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-brand-gold hover:underline"
                          >
                            {selectedProfessional.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-black text-lg">Professional Information</h4>
                    
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="font-medium text-gray-700">{selectedProfessional.bio}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Credentials</p>
                      <p className="font-medium">{selectedProfessional.credentials}</p>
                    </div>

                    {selectedProfessional.hourly_rate && (
                      <div>
                        <p className="text-sm text-gray-600">Hourly Rate</p>
                        <p className="font-medium">${selectedProfessional.hourly_rate}/hr</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-medium">{selectedProfessional.rating.toFixed(1)} ({selectedProfessional.reviews_count} reviews)</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Created: {new Date(selectedProfessional.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-brand-gold">
            <CardHeader className="bg-brand-gold">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl text-brand-black">Professionals</CardTitle>
                <TestModeToggle 
                  onTestModeChange={setTestMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-brand-black">
                  {testMode ? (
                    <span className="font-semibold">🧪 Test Mode Active - Entries will not be published to live site</span>
                  ) : (
                    <span className="font-semibold">✅ Live Mode - Entries are live on the site</span>
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
                    Add Professional
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {professionals.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No professionals found. Professionals will appear here once they are added.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Professional</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Location</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Rating</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {professionals.map((professional) => (
                        <tr key={professional.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {professional.image_url && (
                                <img
                                  src={professional.image_url}
                                  alt={professional.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <p className="font-medium">{professional.name}</p>
                                <p className="text-sm text-gray-600">{professional.title}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize">{professional.category}</td>
                          <td className="py-3 px-4">
                            {professional.city && professional.state ? (
                              <span>{professional.city}, {professional.state}</span>
                            ) : professional.zip ? (
                              <span>{professional.zip}</span>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {professional.verified ? (
                              <Badge className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Unverified</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {professional.rating.toFixed(1)} ({professional.reviews_count})
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setSelectedProfessional(professional)}
                                variant="outline"
                                size="sm"
                                className="border-brand-gold text-brand-black hover:bg-brand-gold"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                onClick={() => handleEdit(professional)}
                                variant="outline"
                                size="sm"
                                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                              >
                                <Edit className="w-4 h-4" />
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
        )}
      </div>

      <AddProfessionalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchProfessionals();
          setShowAddModal(false);
        }}
        testMode={testMode}
      />

      {editingProfessional && (
        <EditProfessionalModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProfessional(null);
          }}
          onSuccess={() => {
            fetchProfessionals();
            setShowEditModal(false);
            setEditingProfessional(null);
            setSelectedProfessional(null);
          }}
          professional={editingProfessional}
        />
      )}

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onSuccess={() => {
          fetchProfessionals();
          setShowBulkImportModal(false);
        }}
        type="professionals"
        apiEndpoint="/api/admin/professionals/import"
        templateUrl="/templates/professionals-template.csv"
        requiredFields={['name', 'category', 'bio', 'email', 'zip', 'status']}
      />
    </div>
  );
}
