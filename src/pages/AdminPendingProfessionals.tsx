import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, ExternalLink, Mail, MapPin, Plus, Upload } from 'lucide-react';
import { AddProfessionalModal } from '@/components/AddProfessionalModal';
import { BulkImportModal } from '@/components/BulkImportModal';

interface PendingProfessional {
  id: string;
  name: string;
  category: string;
  tagline?: string;
  description: string;
  website?: string;
  logo_url?: string;
  zip: string;
  email: string;
  agreement_accepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

const categoryLabels: Record<string, string> = {
  coaching_consulting: 'Coaching & Consulting',
  education_tutoring: 'Education & Tutoring',
  event_hospitality: 'Event & Hospitality',
  finance_insurance: 'Finance & Insurance',
  health_medical: 'Health & Medical',
  legal_advocacy: 'Legal & Advocacy',
  media_marketing: 'Media & Marketing',
  nonprofits_community: 'Nonprofits & Community',
  real_estate_wealth: 'Real Estate & Wealth',
  technology_innovation: 'Technology & Innovation',
  trades_home: 'Trades & Home Services',
  transportation_logistics: 'Transportation & Logistics',
  arts_culture: 'Arts & Culture',
  black_media: 'Black Media',
  faith_resilience: 'Faith & Resilience',
  hbcus_education: 'HBCUs & Education',
  travel_heritage: 'Travel & Heritage',
};

export default function AdminPendingProfessionals() {
  const [pendingProfessionals, setPendingProfessionals] = useState<PendingProfessional[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminSecret, setAdminSecret] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_secret') || '';
    let secret = saved;
    if (!secret) {
      secret = prompt('Enter admin password (temporary)') || '';
      if (secret) localStorage.setItem('admin_secret', secret);
    }
    setAdminSecret(secret);
    fetchPendingProfessionals(secret);
  }, []);

  const fetchPendingProfessionals = async (secretParam?: string) => {
    const secret = secretParam ?? adminSecret;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/professionals/pending?status=pending`,
        {
          headers: { 'X-Admin-Secret': secret },
        }
      );
      if (!response.ok) {
        throw new Error('Unauthorized');
      }
      const data = await response.json();
      setPendingProfessionals(data);
    } catch (error) {
      console.error('Error fetching pending professionals:', error);
      alert('Unauthorized. Please reload and enter the correct admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (professionalId: string) => {
    if (!confirm('Are you sure you want to approve this professional submission?')) {
      return;
    }

    setActionLoading(professionalId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/approve-professional/${professionalId}`,
        {
          method: 'POST',
          headers: { 'X-Admin-Secret': adminSecret },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to approve professional');
      }

      alert('Professional approved successfully! They are now live on the Professionals page.');
      await fetchPendingProfessionals();
    } catch (error) {
      console.error('Error approving professional:', error);
      alert('Failed to approve professional. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (professionalId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return;

    setActionLoading(professionalId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/reject-professional/${professionalId}`,
        {
          method: 'POST',
          headers: { 'X-Admin-Secret': adminSecret },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reject professional');
      }

      alert('Professional submission rejected.');
      await fetchPendingProfessionals();
    } catch (error) {
      console.error('Error rejecting professional:', error);
      alert('Failed to reject professional. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading pending professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="bg-brand-black text-brand-ivory py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Pending Professional Submissions
              </h1>
              <p className="text-xl text-gray-300">
                Review and approve community-submitted professionals
              </p>
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
                className="bg-brand-gold hover:bg-brand-gold/90 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Professional
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pendingProfessionals.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-gray-600">No pending professional submissions</p>
              <p className="text-sm text-gray-500 mt-2">
                New submissions will appear here for review
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingProfessionals.map((professional) => (
              <Card key={professional.id} className="bg-white border-2 border-gray-200 hover:border-brand-gold transition-colors">
                <CardHeader className="bg-brand-charcoal text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{professional.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-brand-gold text-black">
                          {categoryLabels[professional.category] || professional.category}
                        </Badge>
                        <Badge variant="outline" className="text-white border-white">
                          Submitted: {new Date(professional.submitted_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    {professional.logo_url && (
                      <img
                        src={professional.logo_url}
                        alt={professional.name}
                        className="w-20 h-20 rounded-lg object-cover ml-4"
                      />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {professional.tagline && (
                    <div>
                      <h3 className="font-semibold text-brand-gold mb-1">Tagline</h3>
                      <p className="text-gray-700">{professional.tagline}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-brand-gold mb-1">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{professional.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-brand-gold" />
                      <a href={`mailto:${professional.email}`} className="hover:text-brand-gold">
                        {professional.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      <span>ZIP: {professional.zip}</span>
                    </div>

                    {professional.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ExternalLink className="w-4 h-4 text-brand-gold" />
                        <a
                          href={professional.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-gold"
                        >
                          {professional.website}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      {professional.agreement_accepted ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Agreement Accepted</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Agreement Not Accepted</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleApprove(professional.id)}
                      disabled={actionLoading === professional.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {actionLoading === professional.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleReject(professional.id)}
                      disabled={actionLoading === professional.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      {actionLoading === professional.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddProfessionalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchPendingProfessionals();
          setShowAddModal(false);
        }}
        adminSecret={adminSecret}
      />

      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onSuccess={() => {
          fetchPendingProfessionals();
          setShowBulkImportModal(false);
        }}
        adminSecret={adminSecret}
        type="professionals"
        apiEndpoint="/api/admin/professionals/import"
        templateUrl="/templates/professionals-template.csv"
        requiredFields={['name', 'category', 'bio', 'email', 'zip', 'status']}
      />
    </div>
  );
}
