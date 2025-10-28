import { useState, useEffect } from 'react';
import { GraduationCap, Check, X, Eye, DollarSign } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  goal_category: string;
  requirements: string;
  eligibility_criteria: string;
  status: string;
  total_raised: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

interface ScholarshipApplication {
  id: string;
  user_id: string;
  scholarship_id: string;
  scholarship_title: string;
  applicant_name: string;
  email: string;
  phone: string;
  essay: string;
  goal_category: string;
  amount_requested: number;
  additional_info: string;
  status: string;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  updated_at: string;
}

export default function AdminScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scholarships' | 'applications'>('applications');
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const password = prompt('Enter admin password:');
    if (password) {
      setAdminPassword(password);
      fetchData(password);
    }
  }, []);

  const fetchData = async (password: string) => {
    try {
      const [scholRes, appRes] = await Promise.all([
        fetch(`${API_URL}/api/scholarships`),
        fetch(`${API_URL}/api/scholarships/applications`, {
          headers: { 'X-Admin-Secret': password }
        })
      ]);

      if (scholRes.ok) {
        const scholData = await scholRes.json();
        setScholarships(scholData);
      }

      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      } else {
        alert('Unauthorized. Please refresh and enter the correct password.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewApplication = async (applicationId: string, status: string, awardAmount?: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/scholarships/applications/${applicationId}/review`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Secret': adminPassword
          },
          body: JSON.stringify({
            status,
            admin_notes: reviewNotes,
            award_amount: awardAmount
          })
        }
      );

      if (res.ok) {
        alert(`Application ${status}!`);
        setSelectedApplication(null);
        setReviewNotes('');
        fetchData(adminPassword);
      } else {
        alert('Failed to review application');
      }
    } catch (error) {
      console.error('Error reviewing application:', error);
      alert('Failed to review application');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      under_review: 'bg-blue-500',
      approved: 'bg-green-500',
      rejected: 'bg-red-500',
      awarded: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const pendingApplications = applications.filter((a) => a.status === 'pending');
  const reviewedApplications = applications.filter((a) => a.status !== 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-[#C5A14E] text-xl">Loading scholarship data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#C5A14E] mb-2">
            Scholarship Admin Dashboard
          </h1>
          <p className="text-white/80">
            Manage scholarships and review applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 p-6 rounded-xl">
            <GraduationCap className="w-8 h-8 text-[#C5A14E] mb-3" />
            <div className="text-white text-3xl font-bold">{scholarships.length}</div>
            <div className="text-white/60 text-sm">Total Scholarships</div>
          </div>

          <div className="bg-[#1A1A1A] border border-yellow-500/30 p-6 rounded-xl">
            <Eye className="w-8 h-8 text-yellow-500 mb-3" />
            <div className="text-white text-3xl font-bold">{pendingApplications.length}</div>
            <div className="text-white/60 text-sm">Pending Review</div>
          </div>

          <div className="bg-[#1A1A1A] border border-green-500/30 p-6 rounded-xl">
            <Check className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-white text-3xl font-bold">
              {applications.filter((a) => a.status === 'approved').length}
            </div>
            <div className="text-white/60 text-sm">Approved</div>
          </div>

          <div className="bg-[#1A1A1A] border border-blue-500/30 p-6 rounded-xl">
            <DollarSign className="w-8 h-8 text-blue-500 mb-3" />
            <div className="text-white text-3xl font-bold">
              ${scholarships.reduce((sum, s) => sum + s.total_raised, 0).toLocaleString()}
            </div>
            <div className="text-white/60 text-sm">Total Raised</div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-6">
          <div className="flex gap-4 mb-6 border-b border-[#C5A14E]/30">
            <button
              onClick={() => setActiveTab('applications')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'applications'
                  ? 'text-[#C5A14E] border-b-2 border-[#C5A14E]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className={`pb-4 px-4 font-semibold transition-colors ${
                activeTab === 'scholarships'
                  ? 'text-[#C5A14E] border-b-2 border-[#C5A14E]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Scholarships ({scholarships.length})
            </button>
          </div>

          {activeTab === 'applications' ? (
            <div className="space-y-6">
              {pendingApplications.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#C5A14E] mb-4">
                    Pending Review ({pendingApplications.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingApplications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-[#111111] border border-yellow-500/30 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-1">
                              {app.applicant_name}
                            </h4>
                            <p className="text-white/60 text-sm">{app.email}</p>
                            <p className="text-[#C5A14E] font-semibold mt-2">
                              {app.scholarship_title}
                            </p>
                          </div>
                          <span className={`${getStatusColor(app.status)} text-white text-xs px-3 py-1 rounded-full`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p className="text-white/80 text-sm line-clamp-3">{app.essay}</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="flex-1 bg-[#C5A14E] hover:bg-[#8B7355] text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviewedApplications.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white/80 mb-4">
                    Reviewed Applications ({reviewedApplications.length})
                  </h3>
                  <div className="space-y-4">
                    {reviewedApplications.map((app) => (
                      <div
                        key={app.id}
                        className="bg-[#111111] border border-[#C5A14E]/20 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">
                              {app.applicant_name}
                            </h4>
                            <p className="text-white/60 text-sm">{app.scholarship_title}</p>
                            <p className="text-white/40 text-xs mt-1">
                              Reviewed on {formatDate(app.reviewed_at)}
                            </p>
                          </div>
                          <span className={`${getStatusColor(app.status)} text-white text-xs px-3 py-1 rounded-full`}>
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {applications.length === 0 && (
                <div className="text-center text-white/60 py-12">
                  No applications yet.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-[#111111] border border-[#C5A14E]/30 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-[#C5A14E] mb-2">
                        {scholarship.title}
                      </h4>
                      <p className="text-white/80 mb-2">{scholarship.description}</p>
                      <div className="flex gap-4 text-sm text-white/60">
                        <span>Amount: ${scholarship.amount.toLocaleString()}</span>
                        <span>Deadline: {formatDate(scholarship.deadline)}</span>
                        <span>Applications: {scholarship.applications_count}</span>
                      </div>
                    </div>
                    <span className={`${getStatusColor(scholarship.status)} text-white text-xs px-3 py-1 rounded-full`}>
                      {scholarship.status}
                    </span>
                  </div>

                  <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                    <div
                      className="bg-[#C5A14E] h-2 rounded-full"
                      style={{
                        width: `${Math.min((scholarship.total_raised / scholarship.amount) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    ${scholarship.total_raised.toLocaleString()} raised of ${scholarship.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1A1A1A] border border-[#C5A14E]/30 rounded-xl p-8 max-w-4xl w-full my-8">
            <h3 className="text-3xl font-bold text-[#C5A14E] mb-6">
              Review Application
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-2">Applicant Information</h4>
                <div className="bg-[#111111] rounded-lg p-4 space-y-2">
                  <p className="text-white"><span className="text-white/60">Name:</span> {selectedApplication.applicant_name}</p>
                  <p className="text-white"><span className="text-white/60">Email:</span> {selectedApplication.email}</p>
                  <p className="text-white"><span className="text-white/60">Phone:</span> {selectedApplication.phone}</p>
                  <p className="text-white"><span className="text-white/60">Goal Category:</span> {selectedApplication.goal_category.replace(/_/g, ' ')}</p>
                  <p className="text-white"><span className="text-white/60">Amount Requested:</span> ${selectedApplication.amount_requested.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Essay</h4>
                <div className="bg-[#111111] rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{selectedApplication.essay}</p>
                </div>
              </div>

              {selectedApplication.additional_info && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Additional Information</h4>
                  <div className="bg-[#111111] rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedApplication.additional_info}</p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-white font-semibold mb-2">Admin Notes</h4>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111111] border border-[#C5A14E]/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C5A14E]"
                  placeholder="Add notes about your decision..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleReviewApplication(selectedApplication.id, 'approved', selectedApplication.amount_requested)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={() => handleReviewApplication(selectedApplication.id, 'rejected')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedApplication(null);
                  setReviewNotes('');
                }}
                className="px-6 py-3 border border-[#C5A14E]/30 text-[#C5A14E] hover:bg-[#C5A14E]/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
